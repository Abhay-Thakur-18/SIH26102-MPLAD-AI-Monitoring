import mongoose, { Schema } from "mongoose";

export interface IAiResult {
  requestId: string;
  modelName: string;
  confidence: number;
  riskScore: number;
  status: string;
  prediction: Record<string, unknown>;
  explanation: string;
  metadata: Record<string, unknown>;
  entityType: string;
  entityId?: string;
  createdAt: Date;
}

const AiResultSchema = new Schema<IAiResult>(
  {
    requestId: { type: String, required: true, unique: true },
    modelName: { type: String, required: true },
    confidence: { type: Number, required: true },
    riskScore: { type: Number, required: true },
    status: { type: String, required: true },
    prediction: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    entityType: { type: String, required: true },
    entityId: String
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AiResultSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AiResultModel = mongoose.model<IAiResult>("AiResult", AiResultSchema);
