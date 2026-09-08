import mongoose, { Schema } from "mongoose";
import { UserRole, UserStatus } from "../config/constants";
import { Permission } from "../config/permissions";

export interface IDeviceHistory {
  deviceId: string;
  userAgent: string;
  ip: string;
  lastUsedAt: Date;
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  designation?: string;
  organization?: string;
  state?: string;
  district?: string;
  constituency?: string;
  mpCode?: string;
  address?: string;
}

export interface IUserVerification {
  emailVerified: boolean;
  phoneVerified: boolean;
  kycVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
}

export interface IUser {
  email: string;
  password: string;
  role: UserRole;
  profile: IUserProfile;
  verification: IUserVerification;
  permissions: Permission[];
  status: UserStatus;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  deviceHistory: IDeviceHistory[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceHistorySchema = new Schema<IDeviceHistory>(
  {
    deviceId: { type: String, required: true },
    userAgent: { type: String, required: true },
    ip: { type: String, required: true },
    lastUsedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), required: true },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatarUrl: String,
      phone: String,
      designation: String,
      organization: String,
      state: String,
      district: String,
      constituency: String,
      mpCode: String,
      address: String
    },
    verification: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
      kycVerified: { type: Boolean, default: false },
      emailVerifiedAt: Date,
      phoneVerifiedAt: Date
    },
    permissions: { type: [String], default: [] },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.PENDING_VERIFICATION },
    lastLoginAt: Date,
    lastLoginIp: String,
    deviceHistory: { type: [DeviceHistorySchema], default: [] },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ "profile.district": 1, "profile.state": 1 });
UserSchema.index({ isDeleted: 1 });

export const UserModel = mongoose.model<IUser>("User", UserSchema);
