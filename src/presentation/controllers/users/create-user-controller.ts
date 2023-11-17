import { Controller, Validation } from "@presentation/protocols";
import { badRequest, created, serverError } from "../../helpers";
import {
  CreateUser,
  CreateUserParams,
  CreateUserReturn,
} from "@domain/usecases";

export class CreateUserController
  implements Controller<CreateUserParams, CreateUserReturn>
{
  constructor(
    private readonly validation: Validation<CreateUserParams>,
    private readonly createUser: CreateUser,
  ) {}

  async handle(body: CreateUserParams) {
    try {
      const validationResult = await this.validation.validate(body);

      if (!validationResult.success) {
        return badRequest(validationResult);
      }

      const newUser = await this.createUser.create(body);

      return created(newUser);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
