import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ):
    | boolean
    | Promise<boolean>
    | Observable<boolean> {
    const isPublic: boolean =
      this.reflector.getAllAndOverride(
        'isPublic',
        [
          // We are checking by priorities
          // First we check the handlers (routes)
          // Then we check the classes (controllers)
          context.getHandler(),
          context.getClass(),
        ],
      );

    // If true, bypass the guard
    if (isPublic) return true;
    // If not execute the guard
    return super.canActivate(context);
  }
}
