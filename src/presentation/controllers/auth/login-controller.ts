import { Controller, Validation } from '@presentation/protocols';
import { badRequest, noContent, serverError } from '../../helpers';

export type LoginRequest = {
  username: string;
  password: string;
};

function LoginController(
  validation: Validation
): Controller<LoginRequest, void> {
  const handle = async (body: LoginRequest) => {
    try {
      const result = validation.validate(body);

      if (!result.ok) {
        return badRequest(result);
      }

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
