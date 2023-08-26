export type AuthenticationParams = {
  username: string;
  password: string;
};

export type AuthenticationReturn = {
  token: string;
};

export type Authentication = {
  auth: (params: AuthenticationParams) => Promise<AuthenticationReturn>;
};
