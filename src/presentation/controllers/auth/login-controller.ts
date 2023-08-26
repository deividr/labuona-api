import { Controller, Validation } from '@presentation/protocols';
import { Authentication } from '@usecases/authentication';
import { badRequest, ok, serverError } from '../../helpers';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

function LoginController(
  validation: Validation,
  authentication: Authentication
): Controller<LoginRequest, LoginResponse> {
  const handle = async (body: LoginRequest) => {
    try {
      const validationResult = validation.validate(body);

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
