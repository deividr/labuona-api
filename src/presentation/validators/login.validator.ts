import { AuthenticationParams } from "@usecases/authentication";
import { Validation } from "../protocols/validation";
import { z } from "zod";

const AuthenticationParamsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

class LoginValidation implements Validation<AuthenticationParams> {
  async validate(values: AuthenticationParams) {
    AuthenticationParamsSchema.parse(values);
    return { ok: true, message: "Tudo certo meu caro" };
  }
}

export default LoginValidation;
