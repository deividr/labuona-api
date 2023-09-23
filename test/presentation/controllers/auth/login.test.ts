import LoginController from "../../../../src/presentation/controllers/auth/login-controller";
import { serverError, badRequest } from "../../../../src/presentation/helpers";

import { test } from "tap";
import { faker } from "@faker-js/faker";
import { Validation } from "@presentation/protocols";
import {
  Authentication,
  AuthenticationParams,
  AuthenticationReturn,
} from "@usecases/authentication";

const loginRequest: AuthenticationParams = {
  username: "",
  password: "",
};

const authenticationParams: AuthenticationParams = {
  username: "",
  password: "",
};

class AuthenticationValidation implements Validation<AuthenticationParams> {
  async validate(loginRequestReceived: any) {
    Object.keys(loginRequest).forEach(
      (key: string) =>
        (loginRequest[key as keyof AuthenticationParams] =
          loginRequestReceived[key as keyof AuthenticationParams]),
    );
    return { ok: true, message: "" };
  }
}

const makeSut = () => {
  const authenticationReturn: AuthenticationReturn = {
    token: faker.string.uuid(),
  };

  const validationStub = new AuthenticationValidation();

  const authentication: Authentication = {
    auth: async (authenticationParamsReceived: AuthenticationParams) => {
      Object.keys(authenticationParams).forEach(
        (key: string) =>
          (authenticationParams[key as keyof AuthenticationParams] =
            authenticationParamsReceived[key as keyof AuthenticationParams]),
      );
      return authenticationReturn;
    },
  };

  const sut = LoginController(validationStub, authentication);

  return {
    sut,
    validationStub,
    loginRequest,
    authenticationParams,
    authentication,
    authenticationReturn,
  };
};

const mockRequest = (): AuthenticationParams => ({
  username: faker.person.firstName(),
  password: faker.internet.password(),
});

test("should call Validation method with correct values", async (t) => {
  const { sut, loginRequest } = makeSut();
  const loginRequestSend = mockRequest();

  sut.handle(loginRequestSend);

  Object.keys(loginRequestSend).map((key) => {
    t.equal(
      loginRequest[key as keyof AuthenticationParams],
      loginRequestSend[key as keyof AuthenticationParams],
    );
  });
});

test("should return 500 if Validation throw", async (t) => {
  const { sut, validationStub } = makeSut();

  const errorMessage = "Validation throw error";

  validationStub.validate = () => {
    throw new Error(errorMessage);
  };

  const result = await sut.handle(mockRequest());

  t.match(result, serverError(new Error(errorMessage)));
});

test("should return 400 if Validation return a error", async (t) => {
  const { sut, validationStub } = makeSut();

  const errorToReturn = { ok: false, message: "Username invalid" };

  validationStub.validate = async () => {
    return errorToReturn;
  };

  const response = await sut.handle(mockRequest());

  t.same(response, badRequest({ ...errorToReturn }));
});

test("should call Authentication with correct values", async (t) => {
  const { sut, authenticationParams } = makeSut();
  const request = mockRequest();

  await sut.handle(request);

  Object.keys(request).map((key) => {
    t.equal(
      authenticationParams[key as keyof AuthenticationParams],
      request[key as keyof AuthenticationParams],
    );
  });
});

test("should return 500 if Authentication throw", async (t) => {
  const { sut, authentication } = makeSut();

  const errorMessage = "Authentication is failed";

  authentication.auth = () => {
    throw new Error(errorMessage);
  };

  const request = mockRequest();
  const result = await sut.handle(request);
  t.match(result, serverError(new Error(errorMessage)));
});

test("should return 200 if Authentication success", async (t) => {
  const { sut, authenticationReturn } = makeSut();
  const request = mockRequest();
  const result = await sut.handle(request);
  t.equal(result.statusCode, 200);
  t.equal(result.body, authenticationReturn);
});
