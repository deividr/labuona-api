import LoginController from "../../../../presentation/controllers/auth/login-controller";
import { DbAuthentication } from "../../../../data/usecases";
import LoginValidation from "../../../../presentation/validators/login-validator";
import { JwtAdapter } from "../../../../infra/crypto/jwt-adapter";
import { NodeCrypto } from "../../../../infra/crypto/node-crypto-adapter";
import { User } from "../../../../infra/db/postgres/user-postgres-repository";

export const makeLoginControler = () => {
  const validation = new LoginValidation();
  const user = new User();
  const hasher = new NodeCrypto();
  const encrypter = new JwtAdapter();
  const authentication = new DbAuthentication(user, hasher, encrypter);
  return new LoginController(validation, authentication);
};
