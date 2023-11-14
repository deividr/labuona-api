import { Controller, Validation } from "@presentation/protocols";
import { badRequest, serverError } from "../../helpers";
import { CreateUserParams, CreateUserReturn } from "@domain/usecases";

export class CreateUserController
  implements Controller<CreateUserParams, CreateUserReturn>
{
  constructor(private readonly validation: Validation<CreateUserParams>) {}

  async handle(body: CreateUserParams) {
    try {
      const validationResult = await this.validation.validate(body);

      if (!validationResult.success) {
        return badRequest(validationResult);
      }

      return {} as any;
    } catch (error: any) {
      return serverError(error);
    }
  }
}
