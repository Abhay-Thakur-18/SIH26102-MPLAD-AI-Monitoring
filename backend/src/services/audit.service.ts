import { auditRepository } from "../repositories/audit.repository";
import { projectRepository } from "../repositories/project.repository";
import { aiGatewayService } from "../ai/aiGateway.service";
import { ApiError } from "../utils/ApiError";
import { AuditStatus } from "../config/constants";
import { normalizePagination, paginationMeta } from "../utils/pagination";
import { enqueuePdfGeneration } from "../jobs/producers";

export class AuditService {
  async generate(projectId: string, createdBy: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");
    const ai = await aiGatewayService.invoke(
      "audit",
      {
        projectCode: project.projectCode,
        budgetSanctioned: project.budgetSanctioned,
        budgetUtilized: project.budgetUtilized,
        riskScore: project.riskScore,
        progressPercent: project.progressPercent
      },
      { type: "project", id: project.id }
    );
    const report = await auditRepository.create({
      project: project.id,
      isAiGenerated: true,
      evidence: (project.geoImages || []).map((url) => ({ url, type: "image" })),
      riskReasons: [ai.explanation],
      recommendation: String(ai.prediction.recommendation ?? "Review required"),
      status: AuditStatus.AI_GENERATED,
      createdBy: createdBy as never
    });
    await projectRepository.updateById(project.id, { auditStatus: AuditStatus.AI_GENERATED, aiStatus: "COMPLETED" as never });
    await enqueuePdfGeneration({ auditId: report.id });
    return { report, ai };
  }

  async list(query: Record<string, unknown>) {
    const { page, limit, skip } = normalizePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.project) filter.project = query.project;
    if (query.status) filter.status = query.status;
    const { items, total } = await auditRepository.paginate(filter, skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const report = await auditRepository.findById(id);
    if (!report) throw new ApiError(404, "Audit report not found");
    return report;
  }

  async assign(id: string, auditorId: string) {
    const report = await auditRepository.updateById(id, {
      auditor: auditorId as never,
      status: AuditStatus.ASSIGNED
    });
    if (!report) throw new ApiError(404, "Audit report not found");
    return report;
  }

  async addEvidence(id: string, evidence: { url: string; type: string; caption?: string }) {
    const report = await auditRepository.findById(id);
    if (!report) throw new ApiError(404, "Audit report not found");
    report.evidence.push(evidence);
    await report.save();
    return report;
  }

  async updateStatus(id: string, status: AuditStatus, notes?: string) {
    const report = await auditRepository.updateById(id, { status, manualReviewNotes: notes });
    if (!report) throw new ApiError(404, "Audit report not found");
    return report;
  }
}

export const auditService = new AuditService();
