import { Controller, Validation } from '@presentation/protocols';
import { noContent, serverError } from '../../helpers';

export type LoginRequest = {
  username: string;
  password: string;
};

function LoginController(
  validation: Validation
): Controller<LoginRequest, void> {
  const handle = async (body: LoginRequest) => {
    try {
      validation.validate(body);
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
