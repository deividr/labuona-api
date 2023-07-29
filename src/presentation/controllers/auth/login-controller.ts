import type { Validation, Controller } from '@presentation/protocols';

export type LoginControllerBody = {
  username: string;
  password: string;
};

function LoginController(
  validation: Validation
): Controller<LoginControllerBody> {
  const handle = (body: LoginControllerBody) => {
    validation.validate(body);
  };

  return {
    handle,
  };
}

export default LoginController;
