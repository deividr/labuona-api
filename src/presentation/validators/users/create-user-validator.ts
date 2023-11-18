import { CreateUserParams } from "@domain/usecases";
import { Validation } from "../../protocols/validation";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(10),
  username: z.string().min(5),
  password: z.string(),
});

export class CreateUserValidation implements Validation<CreateUserParams> {
  async validate(values: CreateUserParams) {
    const result = CreateUserSchema.safeParse(values);

    if (result.success) {
      return { success: true, message: "ok" };
    }

    return { success: false, message: result.error.errors[0].message };
  }
}
