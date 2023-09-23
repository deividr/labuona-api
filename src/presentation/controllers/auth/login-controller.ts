import { Controller, Validation } from "@presentation/protocols";
import {
  Authentication,
  AuthenticationParams,
  AuthenticationReturn,
} from "@usecases/authentication";
import { badRequest, ok, serverError } from "../../helpers";

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

      if (!validationResult.ok) {
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
