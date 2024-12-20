import { z } from "zod";

export const BillSchema = z.object({
  id: z.string().uuid("ID inválido."),
  cashboxDate: z.date("Data do caixa inválida."),
  tableId: z.number().positive("ID da mesa inválido."),
  tableNumber: z.number().positive("Número da mesa inválido."),
  occupants: z.number().min(1, "Número de ocupantes inválido."),
  subTotal: z.number().nonnegative("Subtotal inválido."),
  applyDiscount: z.boolean("Aplicar desconto deve ser verdadeiro ou falso."),
  discount: z.number().min(0, "Desconto não pode ser negativo.").max(100, "Desconto não pode exceder 100%."),
  applyServiceCharge: z.boolean("Aplicar taxa de serviço deve ser verdadeiro ou falso."),
  serviceCharge: z.number().nonnegative("Taxa de serviço inválida."),
  finalValue: z.number().positive("Valor final deve ser maior que zero."),
  totalPaid: z.number().nonnegative("Total pago deve ser zero ou maior."),
  status: z.enum(["Open", "AwaitingPayment", "PartialPayment", "Paid"], {
    errorMap: () => ({ message: "Status inválido." }),
  }),
  createdBy: z.string().email("Email inválido."),
  createdAt: z.date("Data de criação inválida."),
  updatedBy: z.string().email("Email inválido.").optional(),
  updatedAt: z.date("Data de atualização inválida.").optional(),
  notes: z.string().optional().max(500, "Notas não podem exceder 500 caracteres."),
});

export type Bill = z.infer<typeof BillSchema>;
