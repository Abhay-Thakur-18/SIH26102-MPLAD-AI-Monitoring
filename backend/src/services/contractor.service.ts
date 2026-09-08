import { contractorRepository } from "../repositories/contractor.repository";
import { ApiError } from "../utils/ApiError";
import { normalizePagination, paginationMeta } from "../utils/pagination";
import { IContractor } from "../models/contractor.model";

export class ContractorService {
  create(data: Partial<IContractor>) {
    return contractorRepository.create(data);
  }

  async list(query: Record<string, unknown>) {
    const { page, limit, skip } = normalizePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.district) filter.district = query.district;
    const { items, total } = await contractorRepository.paginate(filter, skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const item = await contractorRepository.findById(id);
    if (!item) throw new ApiError(404, "Contractor not found");
    return item;
  }

  async update(id: string, data: Partial<IContractor>) {
    const item = await contractorRepository.updateById(id, data);
    if (!item) throw new ApiError(404, "Contractor not found");
    return item;
  }
}

export const contractorService = new ContractorService();
