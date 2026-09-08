import { AiResultModel, IAiResult } from "../models/aiResult.model";

export class AiResultRepository {
  create(data: Partial<IAiResult>) {
    return AiResultModel.create(data);
  }

  findByRequestId(requestId: string) {
    return AiResultModel.findOne({ requestId });
  }

  listByEntity(entityType: string, entityId: string) {
    return AiResultModel.find({ entityType, entityId }).sort({ createdAt: -1 });
  }
}

export const aiResultRepository = new AiResultRepository();
