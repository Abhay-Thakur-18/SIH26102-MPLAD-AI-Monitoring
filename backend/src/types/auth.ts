import { UserRole } from "../config/constants";
import { Permission } from "../config/permissions";

export type AuthUser = {
  id: string;
  role: UserRole;
  sessionId: string;
  permissions: Permission[];
  district?: string;
  state?: string;
  mpCode?: string;
};
