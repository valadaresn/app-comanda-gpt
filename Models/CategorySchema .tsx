import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string().uuid("ID da categoria inválido."),
    name: z.string().min(1, "Nome da categoria obrigatório."),
    order: z.number().positive("Ordem de exibição inválida."),
  });
  
  export type Category = z.infer<typeof CategorySchema>;
  