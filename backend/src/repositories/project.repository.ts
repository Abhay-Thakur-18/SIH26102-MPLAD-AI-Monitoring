import { FilterQuery, PipelineStage } from "mongoose";
import { ProjectModel, IProject } from "../models/project.model";

export class ProjectRepository {
  create(data: Partial<IProject>) {
    return ProjectModel.create(data);
  }

  findById(id: string) {
    return ProjectModel.findOne({ _id: id, isDeleted: false });
  }

  findByCode(projectCode: string) {
    return ProjectModel.findOne({ projectCode, isDeleted: false });
  }

  updateById(id: string, data: Partial<IProject>) {
    return ProjectModel.findByIdAndUpdate(id, data, { new: true });
  }

  async paginate(filter: FilterQuery<IProject>, skip: number, limit: number) {
    const query = { isDeleted: false, ...filter };
    const [items, total] = await Promise.all([
      ProjectModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProjectModel.countDocuments(query)
    ]);
    return { items, total };
  }

  softDelete(id: string) {
    return ProjectModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
  }

  listForExport(filter: FilterQuery<IProject>) {
    return ProjectModel.find({ isDeleted: false, ...filter }).sort({ createdAt: -1 });
  }

  aggregate(pipeline: PipelineStage[]) {
    return ProjectModel.aggregate(pipeline);
  }
}

export const projectRepository = new ProjectRepository();
