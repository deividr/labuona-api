import LoginController from '../../../../src/presentation/controllers/auth/login-controller';
import { serverError, badRequest } from '../../../../src/presentation/helpers';

import type { LoginRequest } from '../../../../src/presentation/controllers/auth/login-controller';

import { test } from 'tap';
import { faker } from '@faker-js/faker';
import { Validation } from '@presentation/protocols';
import { Authentication, AuthenticationParams } from '@usecases/authentication';

const makeSut = () => {
  let loginRequest: LoginRequest = {
    username: '',
    password: '',
  };

  let authenticationParams: AuthenticationParams = {
    username: '',
    password: '',
  };

  const validationStub: Validation = {
    validate: (loginRequestReceived: any) => {
      Object.keys(loginRequest).forEach(
        (key: string) =>
          (loginRequest[key as keyof AuthenticationParams] =
            loginRequestReceived[key as keyof AuthenticationParams])
      );
      return { ok: true, message: '' };
    },
  };

  const authentication: Authentication = {
    auth: async (authenticationParamsReceived: AuthenticationParams) => {
      Object.keys(authenticationParams).forEach(
        (key: string) =>
          (authenticationParams[key as keyof AuthenticationParams] =
            authenticationParamsReceived[key as keyof AuthenticationParams])
      );
      return { token: faker.string.uuid() };
    },
  };

  const sut = LoginController(validationStub, authentication);

  return {
    sut,
    validationStub,
    loginRequest,
    authenticationParams,
    authentication,
  };
};

const mockRequest = (): LoginRequest => ({
  username: faker.person.firstName(),
  password: faker.internet.password(),
});

test('should call Validation method with correct values', async (t) => {
  const { sut, loginRequest } = makeSut();
  const loginRequestSend = mockRequest();

  sut.handle(loginRequestSend);

  Object.keys(loginRequestSend).map((key) => {
    t.equal(
      loginRequest[key as keyof LoginRequest],
      loginRequestSend[key as keyof LoginRequest]
    );
  });
});

test('should return 500 if Validation throw', async (t) => {
  const { sut, validationStub } = makeSut();

  const errorMessage = 'Validation throw error';

  validationStub.validate = () => {
    throw new Error(errorMessage);
  };

  const result = await sut.handle(mockRequest());

  t.match(result, serverError(new Error(errorMessage)));
});

test('should return 400 if Validation return a error', async (t) => {
  const { sut, validationStub } = makeSut();

  const errorToReturn = { ok: false, message: 'Username invalid' };

  validationStub.validate = () => {
    return errorToReturn;
  };

  const response = await sut.handle(mockRequest());

  t.same(response, badRequest({ ...errorToReturn }));
});

test('should call Authentication with correct values', async (t) => {
  const { sut, authenticationParams } = makeSut();
  const request = mockRequest();

  await sut.handle(request);

  Object.keys(request).map((key) => {
    t.equal(
      authenticationParams[key as keyof LoginRequest],
      request[key as keyof LoginRequest]
    );
  });
});

test('should return 500 if Authentication throw', async (t) => {
  const { sut, authentication } = makeSut();

  const errorMessage = 'Authentication is failed';

  authentication.auth = () => {
    throw new Error(errorMessage);
  };

  const request = mockRequest();
  const result = await sut.handle(request);
  t.match(result, serverError(new Error(errorMessage)));
});
