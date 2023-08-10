import LoginController from '../../../../src/presentation/controllers/auth/login-controller';
import { serverError, badRequest } from '../../../../src/presentation/helpers';

import type { LoginRequest } from '../../../../src/presentation/controllers/auth/login-controller';

import { test } from 'tap';
import { faker } from '@faker-js/faker';
import { Validation } from '@presentation/protocols';

const makeSut = () => {
  let loginRequest: LoginRequest = {
    username: '',
    password: '',
  };

  const validationStub: Validation = {
    validate: (loginRequestReceived: any) => {
      loginRequest.username = loginRequestReceived.username;
      loginRequest.password = loginRequestReceived.password;
      return { ok: true, message: '' };
    },
  };

  const sut = LoginController(validationStub);

  return { sut, validationStub, loginRequest };
};

const mockRequest = (): LoginRequest => ({
  username: faker.person.firstName(),
  password: faker.internet.password(),
});

test('should call validation method with correct values', async (t) => {
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

test('should return 500 if validation throw', async (t) => {
  const { sut, validationStub } = makeSut();

  const errorMessage = 'Validation throw error';

  validationStub.validate = () => {
    throw new Error(errorMessage);
  };

  const result = await sut.handle(mockRequest());

  t.match(result, serverError(new Error(errorMessage)));
});

test('shoul return 400 if validation return a error', async (t) => {
  const { sut, validationStub } = makeSut();

  const errorToReturn = { ok: false, message: 'Username invalid' };

  validationStub.validate = () => {
    return errorToReturn;
  };

  const response = await sut.handle(mockRequest());

  t.same(response, badRequest(errorToReturn));
});
