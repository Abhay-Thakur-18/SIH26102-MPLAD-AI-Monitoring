import { paymentRepository } from "../repositories/payment.repository";
import { projectRepository } from "../repositories/project.repository";
import { ApiError } from "../utils/ApiError";
import { normalizePagination, paginationMeta } from "../utils/pagination";
import { PaymentStatus } from "../config/constants";
import { IPayment } from "../models/payment.model";

export class PaymentService {
  async create(data: Partial<IPayment>, createdBy: string) {
    const duplicate = await paymentRepository.findByPfms(String(data.pfmsTransactionId));
    if (duplicate) {
      throw new ApiError(409, "Duplicate PFMS transaction", { isDuplicateSuspect: true });
    }
    const similar = await paymentRepository.paginate(
      { project: data.project, amount: data.amount, vendor: data.vendor },
      0,
      1
    );
    const isDuplicateSuspect = similar.total > 0;
    const payment = await paymentRepository.create({
      ...data,
      pfmsTransactionId: String(data.pfmsTransactionId).toUpperCase(),
      isDuplicateSuspect,
      fraudScore: isDuplicateSuspect ? 70 : 0,
      createdBy: createdBy as never
    });
    if (payment.status === PaymentStatus.SUCCESS) {
      await this.syncBudget(String(payment.project));
    }
    return payment;
  }

  async list(query: Record<string, unknown>) {
    const { page, limit, skip } = normalizePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.project) filter.project = query.project;
    if (query.status) filter.status = query.status;
    const { items, total } = await paymentRepository.paginate(filter, skip, limit);
    return { items, meta: paginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new ApiError(404, "Payment not found");
    return payment;
  }

  async updateStatus(id: string, status: PaymentStatus) {
    const payment = await paymentRepository.updateById(id, { status });
    if (!payment) throw new ApiError(404, "Payment not found");
    if (status === PaymentStatus.SUCCESS) await this.syncBudget(String(payment.project));
    return payment;
  }

  async attachMedia(id: string, kind: "invoice" | "receipt", url: string) {
    const data = kind === "invoice" ? { invoiceUrl: url } : { receiptUrl: url };
    const payment = await paymentRepository.updateById(id, data);
    if (!payment) throw new ApiError(404, "Payment not found");
    return payment;
  }

  async budgetSummary(projectId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");
    const sums = await paymentRepository.sumByProject(projectId);
    const consumed = sums[0]?.total ?? 0;
    return {
      budgetSanctioned: project.budgetSanctioned,
      budgetUtilized: consumed,
      remainingBudget: project.budgetSanctioned - consumed
    };
  }

  private async syncBudget(projectId: string) {
    const sums = await paymentRepository.sumByProject(projectId);
    const consumed = sums[0]?.total ?? 0;
    await projectRepository.updateById(projectId, { budgetUtilized: consumed });
  }
}

export const paymentService = new PaymentService();
