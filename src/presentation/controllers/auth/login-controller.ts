import { Controller, Validation } from "@presentation/protocols";
import {
  Authentication,
  AuthenticationParams,
  AuthenticationReturn,
} from "@usecases/authentication";
import { badRequest, ok, serverError } from "../../helpers";

function LoginController(
  validation: Validation<AuthenticationParams>,
  authentication: Authentication,
): Controller<AuthenticationParams, AuthenticationReturn> {
  const handle = async (body: AuthenticationParams) => {
    try {
      const validationResult = await validation.validate(body);

      if (!validationResult.ok) {
        return badRequest(validationResult);
      }

      const response = await authentication.auth(body);

      return ok(response);
    } catch (error: any) {
      return serverError(error);
    }
  };

  return {
    handle,
  };
}

export default LoginController;
