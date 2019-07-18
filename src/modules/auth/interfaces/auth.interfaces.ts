export interface JwtToken {
  token: string;
  login?: string;
  uid?: number;
  id?: number;
}

export interface JwtPayload {
  login: string;
}
