import { HttpResponse } from '../protocols/http-response';

export const ok = (body?: any): HttpResponse<any> => {
  return {
    statusCode: 200,
    body,
  };
};

// export const noContent = (): HttpResponse<any> => {
//   return {
//     statusCode: 200,
//   };
// };

export const serverError = (error: Error): HttpResponse<any> => {
  return {
    statusCode: 500,
    body: error,
  };
};

export const badRequest = (body?: any): HttpResponse<any> => {
  return {
    statusCode: 400,
    body,
  };
};
