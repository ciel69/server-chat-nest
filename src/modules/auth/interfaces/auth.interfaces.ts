export interface JwtToken {
  token: string;
  login?: string;
  uid?: number;
}

export interface JwtPayload {
  login: string;
}
