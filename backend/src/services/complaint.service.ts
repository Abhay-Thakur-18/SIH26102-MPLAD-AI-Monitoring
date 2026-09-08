import { complaintRepository } from "../repositories/complaint.repository";
import { projectRepository } from "../repositories/project.repository";
import { aiGatewayService } from "../ai/aiGateway.service";
import { ApiError } from "../utils/ApiError";
import { normalizePagination, paginationMeta } from "../utils/pagination";
import { IComplaint } from "../models/complaint.model";
import { ComplaintStatus } from "../config/constants";
import { emitEvent } from "../sockets/emitter";
import { SocketEvent } from "../config/constants";

export class ComplaintService {
  async submit(data: Partial<IComplaint>, complainant: string) {
    if (!data.location?.coordinates) throw new ApiError(400, "Location required");
    const nearby = await projectRepository.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: data.location.coordinates },
          distanceField: "distance",
          maxDistance: 5000,
          spherical: true,
          query: { isDeleted: false }
        }
      },
      { $limit: 1 }
    ]);
    const complaint = await complaintRepository.create({
      ...data,
      complainant: complainant as never,
      project: nearby[0]?._id,
      status: ComplaintStatus.SUBMITTED
    });
    let aiMatch;
    try {
      aiMatch = await aiGatewayService.invoke(
        "semantic",
        { text: data.description, projectId: nearby[0]?._id },
        { type: "complaint", id: complaint.id }
      );
      complaint.aiMatchResult = {
        matchedProject: nearby[0]?._id,
        similarity: Number(aiMatch.prediction.similarity ?? aiMatch.confidence),
        explanation: aiMatch.explanation
      };
      complaint.status = ComplaintStatus.MATCHED;
      await complaint.save();
    } catch {
      /* AI optional at ingest */
    }
    emitEvent(SocketEvent.COMPLAINT_CREATED, { complaintId: complaint.id });
    return complaint;
  }

  async list(query: Record<string, unknown>) {
    const { page, limit, skip } = normalizePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.complainant) filter.complainant = query.complainant;
    const { items, total } = await complaintRepository.paginate(filter, skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const item = await complaintRepository.findById(id);
    if (!item) throw new ApiError(404, "Complaint not found");
    return item;
  }

  async updateStatus(id: string, status: ComplaintStatus) {
    const item = await complaintRepository.updateById(id, { status });
    if (!item) throw new ApiError(404, "Complaint not found");
    return item;
  }
}

export const complaintService = new ComplaintService();
