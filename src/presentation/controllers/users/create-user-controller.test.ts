import { test } from "tap";
import { faker } from "@faker-js/faker";
import { Validation } from "@presentation/protocols";
import { CreateUser, CreateUserParams } from "@domain/usecases";
import { CreateUserController } from "./create-user-controller";
import { badRequest, serverError } from "../../helpers";
import { UserSanitize } from "@domain/models";

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

class CreateUserSpy implements CreateUser {
  params: CreateUserParams = {
    name: "",
    username: "",
    password: "",
  };

  async create(createUserRequestReceived: CreateUserParams) {
    Object.keys(this.params).forEach(
      (key: string) =>
        (this.params[key as keyof CreateUserParams] =
          createUserRequestReceived[key as keyof CreateUserParams]),
    );

    const newUser: UserSanitize = {
      ...createUserRequestReceived,
      id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: null,
      isDeleted: false,
    };

    return newUser;
  }
}

const makeSut = () => {
  const validationSpy = new CreateUserValidationSpy();
  const createUserSpy = new CreateUserSpy();
  const sut = new CreateUserController(validationSpy, createUserSpy);

  return {
    sut,
    validationSpy,
    createUserSpy,
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

  t.test("should return 500 if Validation throw", async (t) => {
    const { sut, validationSpy } = makeSut();

    const errorMessage = "Validation throw error";

    validationSpy.validate = () => {
      throw new Error(errorMessage);
    };

    const result = await sut.handle(mockRequest());

    t.match(result, serverError(new Error(errorMessage)));
  });

  t.test("should return 400 if Validation return a error", async (t) => {
    const { sut, validationSpy } = makeSut();

    const errorToReturn = { success: false, message: "Params errors" };

    validationSpy.validate = async () => {
      return errorToReturn;
    };

    const response = await sut.handle(mockRequest());

    t.same(response, badRequest({ ...errorToReturn }));
  });

  t.test("should call CreateUser with correct values", async (t) => {
    const { sut, createUserSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    Object.keys(request).map((key) => {
      t.equal(
        createUserSpy.params[key as keyof CreateUserParams],
        request[key as keyof CreateUserParams],
      );
    });
  });

  t.test("should return 500 if CreateUser throw", async (t) => {
    const { sut, createUserSpy } = makeSut();

    const errorMessage = "Validation throw error";

    createUserSpy.create = () => {
      throw new Error(errorMessage);
    };

    const result = await sut.handle(mockRequest());

    t.match(result, serverError(new Error(errorMessage)));
  });

  t.test("should return 201 if CreateUser success", async (t) => {
    const { sut } = makeSut();
    const request = mockRequest();
    const response = await sut.handle(request);

    t.equal(response.statusCode, 201);
    t.hasOwnProp(response.body, "id");
    t.hasOwnProp(response.body, "createdAt");
    t.hasOwnProp(response.body, "updatedAt");
    t.hasOwnProp(response.body, "isDeleted");
  });
});
