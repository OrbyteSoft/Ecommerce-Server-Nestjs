import { Role } from '@prisma/client';

export class UserPayload {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserPayload;
}
