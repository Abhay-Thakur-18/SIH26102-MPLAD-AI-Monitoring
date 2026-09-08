import { AuthUser } from "./auth";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      authUser?: AuthUser;
    }
  }
}

export {};
