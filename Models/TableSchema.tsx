import { z } from "zod";

export const TableSchema = z.object({
  id: z.number().positive("ID da mesa inválido."), // ID autoincremental que representa o número da mesa
  status: z.enum(["Free", "Occupied", "Reserved"], {
    errorMap: () => ({ message: "Status da mesa inválido." }),
  }),
  createdBy: z.string().email("Email inválido."),
  createdAt: z.date("Data de criação inválida."),
  updatedBy: z.string().email("Email inválido.").optional(),
  updatedAt: z.date("Data de atualização inválida.").optional(),
});

export type Table = z.infer<typeof TableSchema>;