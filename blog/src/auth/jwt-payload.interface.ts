export interface JwtPayload {
  sub: string;
  username: string;
  tokenType: 'access' | 'refresh';
}
