export type AuthenticationParams = {
  username: string;
  password: string;
};

export type AuthenticationReturn = {
  token: string;
};

export interface Authentication {
  auth: (params: AuthenticationParams) => Promise<AuthenticationReturn>;
}
