import { z } from "zod";

export const ProductSchema = z.object({
    id: z.string().uuid("ID do produto inválido."),
    categoryId: z.string().uuid("ID da categoria inválido."),
    categoryName: z.string().min(1, "Nome da categoria obrigatório."),
    name: z.string().min(1, "Nome do produto obrigatório."),
    shortName: z.string().max(20, "Nome abreviado não pode exceder 20 caracteres."),
    price: z.number().positive("Preço do produto inválido."),
    createdBy: z.string().email("Email inválido."),
    createdAt: z.date("Data de criação inválida."),
    updatedBy: z.string().email("Email inválido.").optional(),
    updatedAt: z.date("Data de atualização inválida.").optional(),
  });
  
  export type Product = z.infer<typeof ProductSchema>;
  