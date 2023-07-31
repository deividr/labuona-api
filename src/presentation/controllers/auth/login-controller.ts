import type { Validation, Controller } from '@presentation/protocols';

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
      return { statusCode: 200 };
    } catch (error) {
      return { statusCode: 500 };
    }
  };

  return {
    handle,
  };
}

export default LoginController;
