import { Controller, Validation } from "@presentation/protocols";
import { Authentication } from "@usecases/authentication";
import { badRequest, noContent, serverError } from "../../helpers";

export type LoginRequest = {
  username: string;
  password: string;
};

function LoginController(
  validation: Validation,
  authentication: Authentication
): Controller<LoginRequest, void> {
  const handle = async (body: LoginRequest) => {
    try {
      const validationResult = validation.validate(body);

      if (!validationResult.ok) {
        return badRequest(validationResult);
      }

      await authentication.auth(body);

      return noContent();
    } catch (error: any) {
      return serverError(error);
    }
  };

  return {
    handle,
  };
}

export default LoginController;
