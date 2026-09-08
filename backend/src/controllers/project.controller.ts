import { projectService } from "../services/project.service";
import { uploadBuffer } from "../config/cloudinary";
import { MediaFolder } from "../config/constants";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { enqueueImageProcessing } from "../jobs/producers";
import { emitEvent } from "../sockets/emitter";
import { SocketEvent } from "../config/constants";

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.create(req.body, req.authUser!.id);
  emitEvent(SocketEvent.PROJECT_UPDATED, { projectId: project.id });
  res.status(201).json(ok("Project created", project, { requestId: req.requestId }));
});

export const listProjects = asyncHandler(async (req, res) => {
  const { items, meta } = await projectService.list(req.query as Record<string, unknown>, req.authUser!);
  res.status(200).json(ok("Projects fetched", items, { ...meta, requestId: req.requestId }));
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getById(req.params.id, req.authUser!);
  res.status(200).json(ok("Project fetched", project, { requestId: req.requestId }));
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.update(req.params.id, req.body);
  emitEvent(SocketEvent.PROJECT_UPDATED, { projectId: project.id });
  res.status(200).json(ok("Project updated", project, { requestId: req.requestId }));
});

export const assignContractor = asyncHandler(async (req, res) => {
  const project = await projectService.assignContractor(req.params.id, req.body.contractorId);
  res.status(200).json(ok("Contractor assigned", project, { requestId: req.requestId }));
});

export const updateMilestone = asyncHandler(async (req, res) => {
  const project = await projectService.updateMilestone(req.params.id, req.params.milestoneId, req.body);
  res.status(200).json(ok("Milestone updated", project, { requestId: req.requestId }));
});

export const uploadProjectImage = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json(ok("File required"));
    return;
  }
  const asset = await uploadBuffer({
    buffer: file.buffer,
    folder: MediaFolder.PROJECTS,
    mimeType: file.mimetype,
    uploadedBy: req.authUser!.id,
    entityType: "project",
    entityId: req.params.id
  });
  const project = await projectService.addGeoImage(req.params.id, asset.url);
  await enqueueImageProcessing({ projectId: req.params.id, url: asset.url });
  res.status(201).json(ok("Image uploaded", { project, asset }, { requestId: req.requestId }));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectService.softDelete(req.params.id);
  res.status(200).json(ok("Project deleted", project, { requestId: req.requestId }));
});

export const exportProjects = asyncHandler(async (req, res) => {
  const items = await projectService.export(req.query as Record<string, unknown>, req.authUser!);
  res.status(200).json(ok("Projects exported", items, { requestId: req.requestId }));
});

export const getProjectRisk = asyncHandler(async (req, res) => {
  const project = await projectService.getById(req.params.id, req.authUser!);
  res.status(200).json(ok("Project risk", { riskScore: project.riskScore, aiStatus: project.aiStatus }, { requestId: req.requestId }));
});
