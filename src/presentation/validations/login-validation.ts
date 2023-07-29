import { Validation } from '../protocols/validation';

type LoginRequest = {
  username: string;
  password: string;
};

function LoginValidation(loginRequest: LoginRequest): Validation {
  const validate = () => {
    return { ok: true, message: 'Tudo certo meu caro' };
  };

  return { validate };
}

export default LoginValidation;
