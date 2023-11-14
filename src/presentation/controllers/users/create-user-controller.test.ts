import { test } from "tap";
import { faker } from "@faker-js/faker";
import { Validation } from "@presentation/protocols";
import { CreateUserParams } from "@domain/usecases";
import { CreateUserController } from "./create-user-controller";

class CreateUserValidationSpy implements Validation<CreateUserParams> {
  createUserRequest: CreateUserParams = {
    name: "",
    username: "",
    password: "",
  };

  async validate(createUserRequestReceived: any) {
    Object.keys(this.createUserRequest).forEach(
      (key: string) =>
        (this.createUserRequest[key as keyof CreateUserParams] =
          createUserRequestReceived[key as keyof CreateUserParams]),
    );
    return { success: true, message: "" };
  }
}

const makeSut = () => {
  const validationSpy = new CreateUserValidationSpy();
  const sut = new CreateUserController(validationSpy);

  return {
    sut,
    validationSpy,
  };
};

const mockRequest = (): CreateUserParams => ({
  name: faker.person.fullName(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
});

test("Create User Controller", async (t) => {
  t.test("should call Validation method with correct values", async (t) => {
    const { sut, validationSpy } = makeSut();
    const createUserRequestSend = mockRequest();

    await sut.handle(createUserRequestSend);

    Object.keys(createUserRequestSend).map((key) => {
      t.equal(
        validationSpy.createUserRequest[key as keyof CreateUserParams],
        createUserRequestSend[key as keyof CreateUserParams],
      );
    });
  });
});
