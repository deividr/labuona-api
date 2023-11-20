import { DbCreateUser } from "../../../../data/usecases/users/db-create-user";
import { CreateUserController } from "../../../../presentation/controllers/users/create-user-controller";
import { User } from "../../../../infra/db/postgres/user-postgres-repository";
import { NodeCrypto } from "../../../../infra/crypto/node-crypto-adapter";
import { CreateUserValidation } from "../../../../presentation/validators";

export const makeCreateUserController = () => {
  const validation = new CreateUserValidation();
  const hasher = new NodeCrypto();
  const userRepository = new User();
  const createUser = new DbCreateUser(hasher, userRepository);
  const createLoginController = new CreateUserController(
    validation,
    createUser,
  );
  return createLoginController;
};
