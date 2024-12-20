import { z } from "zod";

export const OrderSchema = z.object({
    id: z.string().uuid("ID do pedido inválido."),
    billId: z.string().uuid("ID da comanda inválido."),
    orderStatus: z.enum(["Pending", "InPreparation", "Ready", "Cancelled"], {
      errorMap: () => ({ message: "Status do pedido inválido." }),
    }),
    createdBy: z.string().email("Email inválido."),
    createdAt: z.date("Data de criação inválida."),
    updatedBy: z.string().email("Email inválido.").optional(),
    updatedAt: z.date("Data de atualização inválida.").optional(),
  });
  
  export type Order = z.infer<typeof OrderSchema>;
  