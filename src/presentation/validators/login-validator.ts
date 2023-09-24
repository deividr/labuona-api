import { AuthenticationParams } from "@usecases/authentication";
import { Validation } from "../protocols/validation";
import { z } from "zod";

const AuthenticationParamsSchema = z.object({
  username: z.string().min(5),
  password: z.string(),
});

class LoginValidation implements Validation<AuthenticationParams> {
  async validate(values: AuthenticationParams) {
    const result = AuthenticationParamsSchema.safeParse(values);

    if (result.success) {
      return { success: true, message: "Tudo certo meu caro" };
    }

    return { success: false, message: result.error.errors[0].message };
  }
}

export default LoginValidation;
