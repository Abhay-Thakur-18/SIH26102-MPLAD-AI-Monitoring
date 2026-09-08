import { FilterQuery } from "mongoose";
import { ComplaintModel, IComplaint } from "../models/complaint.model";

export class ComplaintRepository {
  create(data: Partial<IComplaint>) {
    return ComplaintModel.create(data);
  }

  findById(id: string) {
    return ComplaintModel.findOne({ _id: id, isDeleted: false });
  }

  updateById(id: string, data: Partial<IComplaint>) {
    return ComplaintModel.findByIdAndUpdate(id, data, { new: true });
  }

  async paginate(filter: FilterQuery<IComplaint>, skip: number, limit: number) {
    const query = { isDeleted: false, ...filter };
    const [items, total] = await Promise.all([
      ComplaintModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ComplaintModel.countDocuments(query)
    ]);
    return { items, total };
  }
}

export const complaintRepository = new ComplaintRepository();
