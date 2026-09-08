import mongoose from "mongoose";
import { ProjectModel } from "../models/project.model";
import { PaymentModel } from "../models/payment.model";
import { ContractorModel } from "../models/contractor.model";
import { ComplaintModel } from "../models/complaint.model";
import { ProjectStatus, PaymentStatus } from "../config/constants";

export class DashboardService {
  async summary() {
    const [projects, delayed, completed, payments, complaints] = await Promise.all([
      ProjectModel.countDocuments({ isDeleted: false }),
      ProjectModel.countDocuments({ isDeleted: false, status: ProjectStatus.DELAYED }),
      ProjectModel.countDocuments({ isDeleted: false, status: ProjectStatus.COMPLETED }),
      PaymentModel.aggregate([
        { $match: { isDeleted: false, status: PaymentStatus.SUCCESS } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      ComplaintModel.countDocuments({ isDeleted: false })
    ]);
    return {
      projectCount: projects,
      delaySummary: { delayed, completed },
      budgetSummary: { consumed: payments[0]?.total ?? 0 },
      complaintCount: complaints
    };
  }

  async riskHeatmap() {
    return ProjectModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { state: "$state", district: "$district" },
          avgRisk: { $avg: "$riskScore" },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgRisk: -1 } }
    ]);
  }

  async fraudSummary() {
    return PaymentModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          flagged: { $sum: { $cond: ["$isDuplicateSuspect", 1, 0] } },
          avgFraudScore: { $avg: "$fraudScore" }
        }
      }
    ]);
  }

  async integrityRanking() {
    return ContractorModel.find({ isDeleted: false })
      .sort({ integrityScore: -1 })
      .limit(20)
      .select("organization integrityScore performanceScore riskLevel district");
  }

  async districtAnalytics(district: string) {
    return ProjectModel.aggregate([
      { $match: { isDeleted: false, district } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          budget: { $sum: "$budgetSanctioned" },
          utilized: { $sum: "$budgetUtilized" }
        }
      }
    ]);
  }

  async mpAnalytics(mpId: string) {
    return ProjectModel.aggregate([
      { $match: { isDeleted: false, mp: new mongoose.Types.ObjectId(mpId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgRisk: { $avg: "$riskScore" }
        }
      }
    ]);
  }

  async stateAnalytics(state: string) {
    return ProjectModel.aggregate([
      { $match: { isDeleted: false, state } },
      {
        $group: {
          _id: "$district",
          count: { $sum: 1 },
          avgRisk: { $avg: "$riskScore" },
          budget: { $sum: "$budgetSanctioned" }
        }
      }
    ]);
  }
}

export const dashboardService = new DashboardService();
