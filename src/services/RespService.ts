import { RouteError } from '@src/other/classes';

export interface IResponse {
  data: unknown;
  status: string;
}

export const PrepareJsonResponse = (data: unknown): IResponse => {
  return {
    data,
    status: 'success',
  };
};

export const PrepareErrorResponse = (error: RouteError): IResponse => {
  return {
    data: { code: error.status, message: error.message },
    status: 'failed',
  };
};
