import { Reflector } from '@nestjs/core';

export class RoleGuard {
  constructor(private reflector: Reflector) {}
}
