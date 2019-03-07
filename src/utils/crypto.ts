import * as crypto from 'crypto';

export function createSalt(): string {
  return crypto.randomBytes(128).toString('base64');
}

export function createHash(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 3, 128, 'sha1')
    .toString('base64');
}
