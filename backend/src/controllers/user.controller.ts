import { userService } from "../services/user.service";
import { ok } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const listUsers = asyncHandler(async (req, res) => {
  const { items, meta } = await userService.list(req.query as Record<string, unknown>);
  res.status(200).json(ok("Users fetched", items, { ...meta, requestId: req.requestId }));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.status(200).json(ok("User fetched", user, { requestId: req.requestId }));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.authUser!.id);
  res.status(200).json(ok("Current user profile", user, { requestId: req.requestId }));
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json(ok("User created", user, { requestId: req.requestId }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const id = req.params.id || req.authUser!.id;
  const user = await userService.updateProfile(id, req.body);
  res.status(200).json(ok("Profile updated", user, { requestId: req.requestId }));
});

export const verifyUser = asyncHandler(async (req, res) => {
  const user = await userService.verify(req.params.id, req.body);
  res.status(200).json(ok("User verification updated", user, { requestId: req.requestId }));
});

export const bulkImportUsers = asyncHandler(async (req, res) => {
  const result = await userService.bulkImport(req.body.users);
  res.status(201).json(ok("Users imported", result, { requestId: req.requestId }));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.softDelete(req.params.id);
  res.status(200).json(ok("User deleted", user, { requestId: req.requestId }));
});

export const restoreUser = asyncHandler(async (req, res) => {
  const user = await userService.restore(req.params.id);
  res.status(200).json(ok("User restored", user, { requestId: req.requestId }));
});
