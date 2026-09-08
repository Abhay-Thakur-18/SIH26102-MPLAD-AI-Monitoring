import { ActivityLogModel, IActivityLog } from "../models/activityLog.model";

export class ActivityLogRepository {
  create(data: Partial<IActivityLog>) {
    return ActivityLogModel.create(data);
  }
}

export const activityLogRepository = new ActivityLogRepository();
