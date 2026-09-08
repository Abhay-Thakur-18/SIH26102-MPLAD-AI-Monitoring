import { FilterQuery } from "mongoose";
import { ContractorModel, IContractor } from "../models/contractor.model";

export class ContractorRepository {
  create(data: Partial<IContractor>) {
    return ContractorModel.create(data);
  }

  findById(id: string) {
    return ContractorModel.findOne({ _id: id, isDeleted: false });
  }

  findByPan(pan: string) {
    return ContractorModel.findOne({ pan: pan.toUpperCase(), isDeleted: false });
  }

  updateById(id: string, data: Partial<IContractor>) {
    return ContractorModel.findByIdAndUpdate(id, data, { new: true });
  }

  async paginate(filter: FilterQuery<IContractor>, skip: number, limit: number) {
    const query = { isDeleted: false, ...filter };
    const [items, total] = await Promise.all([
      ContractorModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContractorModel.countDocuments(query)
    ]);
    return { items, total };
  }
}

export const contractorRepository = new ContractorRepository();
