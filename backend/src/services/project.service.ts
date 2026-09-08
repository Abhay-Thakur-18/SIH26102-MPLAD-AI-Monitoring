import { FilterQuery } from "mongoose";
import { projectRepository } from "../repositories/project.repository";
import { contractorRepository } from "../repositories/contractor.repository";
import { IProject } from "../models/project.model";
import { ApiError } from "../utils/ApiError";
import { normalizePagination, paginationMeta } from "../utils/pagination";
import { UserRole } from "../config/constants";
import { AuthUser } from "../types/auth";

export class ProjectService {
  scopeFilter(user: AuthUser): FilterQuery<IProject> {
    if (user.role === UserRole.MP) return { mp: user.id };
    if (user.role === UserRole.CONTRACTOR) return {};
    if (user.role === UserRole.DISTRICT_AUTHORITY && user.district) return { district: user.district };
    return {};
  }

  async create(data: Partial<IProject>, createdBy: string) {
    const existing = await projectRepository.findByCode(String(data.projectCode));
    if (existing) throw new ApiError(409, "Project code already exists");
    return projectRepository.create({ ...data, createdBy: createdBy as never });
  }

  async list(query: Record<string, unknown>, user: AuthUser) {
    const { page, limit, skip } = normalizePagination(query);
    const filter: FilterQuery<IProject> = { ...this.scopeFilter(user) };
    if (query.status) filter.status = query.status;
    if (query.district) filter.district = query.district;
    if (query.state) filter.state = query.state;
    if (query.mp) filter.mp = query.mp;
    if (query.search) filter.$text = { $search: String(query.search) };
    const { items, total } = await projectRepository.paginate(filter, skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  }

  async getById(id: string, user: AuthUser) {
    const project = await projectRepository.findById(id);
    if (!project) throw new ApiError(404, "Project not found");
    const scoped = this.scopeFilter(user);
    if (scoped.mp && String(project.mp) !== user.id) throw new ApiError(403, "Forbidden");
    return project;
  }

  async update(id: string, data: Partial<IProject>) {
    const project = await projectRepository.updateById(id, data);
    if (!project || project.isDeleted) throw new ApiError(404, "Project not found");
    return project;
  }

  async assignContractor(id: string, contractorId: string) {
    const contractor = await contractorRepository.findById(contractorId);
    if (!contractor) throw new ApiError(404, "Contractor not found");
    const project = await projectRepository.updateById(id, { contractor: contractorId as never });
    if (!project) throw new ApiError(404, "Project not found");
    return project;
  }

  async updateMilestone(id: string, milestoneId: string, payload: Record<string, unknown>) {
    const project = await projectRepository.findById(id);
    if (!project) throw new ApiError(404, "Project not found");
    const milestone = project.milestones.find((m) => String(m._id) === milestoneId);
    if (!milestone) throw new ApiError(404, "Milestone not found");
    Object.assign(milestone, payload);
    const completed = project.milestones.filter((m) => m.status === "COMPLETED").length;
    project.progressPercent = Math.round((completed / Math.max(project.milestones.length, 1)) * 100);
    project.completionPercent = project.progressPercent;
    await project.save();
    return project;
  }

  async addGeoImage(id: string, url: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw new ApiError(404, "Project not found");
    project.geoImages.push(url);
    await project.save();
    return project;
  }

  async softDelete(id: string) {
    const project = await projectRepository.softDelete(id);
    if (!project) throw new ApiError(404, "Project not found");
    return project;
  }

  async export(query: Record<string, unknown>, user: AuthUser) {
    const filter: FilterQuery<IProject> = { ...this.scopeFilter(user) };
    if (query.district) filter.district = query.district;
    return projectRepository.listForExport(filter);
  }
}

export const projectService = new ProjectService();
