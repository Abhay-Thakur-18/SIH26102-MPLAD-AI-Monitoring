import { FilterQuery } from "mongoose";
import { AuditReportModel, IAuditReport } from "../models/auditReport.model";

export class AuditRepository {
  create(data: Partial<IAuditReport>) {
    return AuditReportModel.create(data);
  }

  findById(id: string) {
    return AuditReportModel.findOne({ _id: id, isDeleted: false });
  }

  updateById(id: string, data: Partial<IAuditReport>) {
    return AuditReportModel.findByIdAndUpdate(id, data, { new: true });
  }

  async paginate(filter: FilterQuery<IAuditReport>, skip: number, limit: number) {
    const query = { isDeleted: false, ...filter };
    const [items, total] = await Promise.all([
      AuditReportModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditReportModel.countDocuments(query)
    ]);
    return { items, total };
  }
}

export const auditRepository = new AuditRepository();
