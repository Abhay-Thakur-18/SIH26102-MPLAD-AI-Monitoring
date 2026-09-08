import mongoose, { Schema } from "mongoose";
import { PaymentStage, PaymentStatus } from "../config/constants";

export interface IPayment {
  pfmsTransactionId: string;
  project: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  amount: number;
  paymentStage: PaymentStage;
  invoiceUrl?: string;
  receiptUrl?: string;
  status: PaymentStatus;
  fraudScore: number;
  isDuplicateSuspect: boolean;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    pfmsTransactionId: { type: String, required: true, unique: true, uppercase: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Contractor", required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentStage: { type: String, enum: Object.values(PaymentStage), required: true },
    invoiceUrl: String,
    receiptUrl: String,
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.INITIATED },
    fraudScore: { type: Number, default: 0, min: 0, max: 100 },
    isDuplicateSuspect: { type: Boolean, default: false },
    notes: String,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

PaymentSchema.index({ project: 1, status: 1 });
PaymentSchema.index({ vendor: 1 });

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
