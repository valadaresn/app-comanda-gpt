import { z } from "zod";

export const OrderItemSchema = z.object({
    id: z.string().uuid("ID do item inválido."),
    orderId: z.string().uuid("ID do pedido inválido."),
    productId: z.string().uuid("ID do produto inválido."),
    productName: z.string().min(1, "Nome do produto obrigatório."),
    categoryName: z.string().min(1, "Nome da categoria obrigatório."),
    salePrice: z.number().positive("Preço de venda inválido."),
    quantity: z.number().positive("Quantidade inválida."),
    total: z.number().positive("Total inválido."),
    sector: z.object({
      kitchen: z.boolean("Valor para cozinha inválido."),
      barbecue: z.boolean("Valor para churrasqueira inválido."),
    }),
    deliveredEarly: z.boolean("Valor de entrega antecipada inválido."),
    canceled: z.boolean("Valor de cancelado inválido."),
  });
  
  export type OrderItem = z.infer<typeof OrderItemSchema>;
  