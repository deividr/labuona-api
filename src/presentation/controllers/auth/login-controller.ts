import { Controller, Validation } from "@presentation/protocols";
import { badRequest, ok, serverError } from "../../helpers";
import {
  Authentication,
  AuthenticationParams,
  AuthenticationReturn,
} from "@domain/usecases";

class LoginController
  implements Controller<AuthenticationParams, AuthenticationReturn>
{
  constructor(
    private readonly validation: Validation<AuthenticationParams>,
    private readonly authentication: Authentication,
  ) {}

  async handle(body: AuthenticationParams) {
    try {
      const validationResult = await this.validation.validate(body);

      if (!validationResult.success) {
        return badRequest(validationResult);
      }

      const response = await this.authentication.auth(body);

      return ok(response);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

export default LoginController;
