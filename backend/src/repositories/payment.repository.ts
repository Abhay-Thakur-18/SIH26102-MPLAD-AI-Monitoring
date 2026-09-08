import mongoose from "mongoose";
import { FilterQuery } from "mongoose";
import { PaymentModel, IPayment } from "../models/payment.model";

export class PaymentRepository {
  create(data: Partial<IPayment>) {
    return PaymentModel.create(data);
  }

  findById(id: string) {
    return PaymentModel.findOne({ _id: id, isDeleted: false });
  }

  findByPfms(pfmsTransactionId: string) {
    return PaymentModel.findOne({ pfmsTransactionId: pfmsTransactionId.toUpperCase() });
  }

  updateById(id: string, data: Partial<IPayment>) {
    return PaymentModel.findByIdAndUpdate(id, data, { new: true });
  }

  async paginate(filter: FilterQuery<IPayment>, skip: number, limit: number) {
    const query = { isDeleted: false, ...filter };
    const [items, total] = await Promise.all([
      PaymentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      PaymentModel.countDocuments(query)
    ]);
    return { items, total };
  }

  sumByProject(projectId: string) {
    return PaymentModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
          isDeleted: false,
          status: { $in: ["SUCCESS", "PROCESSING"] }
        }
      },
      { $group: { _id: "$project", total: { $sum: "$amount" } } }
    ]);
  }
}

export const paymentRepository = new PaymentRepository();
