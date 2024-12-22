import { z } from "zod";

const getDefaultCashboxDate = () => {
  const now = new Date();
  if (now.getHours() >= 3) {
    return new Date(now.setDate(now.getDate() - 1));
  }
  return now;
};

export const BillSchema = z.object({
  id: z.string().uuid("ID inválido."),
  cashboxDate: z.date("Data do caixa inválida.").default(getDefaultCashboxDate),
  tableId: z.number().positive("ID da mesa inválido."),
  occupants: z.number().min(1, "Número de ocupantes inválido."),
  subTotal: z.number().nonnegative("Subtotal inválido.").default(0),
  applyDiscount: z.boolean("Aplicar desconto deve ser verdadeiro ou falso.").default(false),
  discount: z.number().min(0, "Desconto não pode ser negativo.").max(100, "Desconto não pode exceder 100%").nullable(),
  applyServiceCharge: z.boolean("Aplicar taxa de serviço deve ser verdadeiro ou falso.").default(false),
  serviceCharge: z.number().nonnegative("Taxa de serviço inválida.").nullable(),
  finalValue: z.number().nonnegative("Valor final deve ser maior que zero.").default(0),
  totalPaid: z.number().nonnegative("Total pago deve ser zero ou maior.").default(0),
  status: z.enum(["Open", "AwaitingPayment", "PartialPayment", "Paid"], {
    errorMap: () => ({ message: "Status inválido." }),
  }).default("Open"),
  createdBy: z.string().email("Email inválido."),
  createdAt: z.date("Data de criação inválida.").default(new Date()),
  updatedBy: z.string().email("Email inválido.").optional(),
  updatedAt: z.date("Data de atualização inválida.").optional(),
  notes: z.string().optional().max(500, "Notas não podem exceder 500 caracteres."),
});

export type Bill = z.infer<typeof BillSchema>;