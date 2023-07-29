import type { Validation } from '@presentation/protocols';

import LoginController from '../../../../src/presentation/controllers/auth/login-controller';

import { test } from 'tap';
import { faker } from '@faker-js/faker';

const makeSut = () => {
  let body: any = {};

  const validationStub: Validation = {
    validate: (bodyReceived: any) => {
      body.username = bodyReceived.username;
      body.password = bodyReceived.password;
      return { ok: true, message: '' };
    },
  };

  const sut = LoginController(validationStub);

  return { sut, value: body };
};

test('should call validation method with correct values', async (t) => {
  const { sut, value } = makeSut();
  const valueSend: any = {
    username: faker.person.firstName(),
    password: faker.internet.password(),
  };

  sut.handle(valueSend);

  Object.keys(valueSend).map((key) => {
    t.equal(value[key], valueSend[key]);
  });
});
