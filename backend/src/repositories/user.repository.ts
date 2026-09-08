import { FilterQuery, Types } from "mongoose";
import { UserModel, IUser } from "../models/user.model";
import { UserStatus } from "../config/constants";

export class UserRepository {
  create(data: Partial<IUser>) {
    return UserModel.create(data);
  }

  findById(id: string, withPassword = false) {
    const q = UserModel.findOne({ _id: id, isDeleted: false });
    return withPassword ? q.select("+password") : q;
  }

  findByEmail(email: string, withPassword = false) {
    const q = UserModel.findOne({ email: email.toLowerCase(), isDeleted: false });
    return withPassword ? q.select("+password") : q;
  }

  findByEmailIncludingDeleted(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+password");
  }

  updateById(id: string, data: Partial<IUser>) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async paginate(filter: FilterQuery<IUser>, skip: number, limit: number) {
    const query = { isDeleted: false, ...filter };
    const [items, total] = await Promise.all([
      UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserModel.countDocuments(query)
    ]);
    return { items, total };
  }

  softDelete(id: string) {
    return UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), status: UserStatus.DELETED },
      { new: true }
    );
  }

  restore(id: string) {
    return UserModel.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: undefined, status: UserStatus.ACTIVE },
      { new: true }
    );
  }

  insertMany(docs: Partial<IUser>[]) {
    return UserModel.insertMany(docs);
  }
}

export const userRepository = new UserRepository();
export { Types };
