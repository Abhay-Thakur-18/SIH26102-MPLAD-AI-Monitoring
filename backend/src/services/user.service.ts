import { FilterQuery } from "mongoose";
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { UserRole, UserStatus } from "../config/constants";
import { ROLE_PERMISSIONS } from "../config/permissions";
import { env } from "../config/env";
import { normalizePagination, paginationMeta } from "../utils/pagination";

export class UserService {
  async list(query: Record<string, unknown>) {
    const { page, limit, skip } = normalizePagination(query);
    const filter: FilterQuery<IUser> = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.district) filter["profile.district"] = query.district;
    if (query.search) {
      filter.$or = [
        { email: { $regex: query.search, $options: "i" } },
        { "profile.firstName": { $regex: query.search, $options: "i" } },
        { "profile.lastName": { $regex: query.search, $options: "i" } }
      ];
    }
    const { items, total } = await userRepository.paginate(filter, skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    district?: string;
    state?: string;
    mpCode?: string;
  }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ApiError(409, "Email already registered");
    const password = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
    return userRepository.create({
      email: data.email.toLowerCase(),
      password,
      role: data.role,
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        district: data.district,
        state: data.state,
        mpCode: data.mpCode
      },
      verification: { emailVerified: false, phoneVerified: false, kycVerified: false },
      permissions: ROLE_PERMISSIONS[data.role],
      status: UserStatus.PENDING_VERIFICATION,
      deviceHistory: []
    });
  }

  async updateProfile(id: string, profile: Record<string, unknown>) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    Object.assign(user.profile, profile);
    await user.save();
    return user;
  }

  async verify(id: string, payload: { emailVerified?: boolean; phoneVerified?: boolean; kycVerified?: boolean }) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    Object.assign(user.verification, payload);
    if (user.verification.emailVerified) user.status = UserStatus.ACTIVE;
    await user.save();
    return user;
  }

  async bulkImport(rows: Array<Parameters<UserService["create"]>[0]>) {
    const created = [];
    for (const row of rows) {
      created.push(await this.create(row));
    }
    return { imported: created.length };
  }

  async softDelete(id: string) {
    const user = await userRepository.softDelete(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async restore(id: string) {
    const user = await userRepository.restore(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }
}

export const userService = new UserService();
