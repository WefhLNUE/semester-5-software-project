import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log("🔥 JwtAuthGuard: canActivate CALLED");
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    console.log("🔥 JwtAuthGuard: handleRequest()", { err, user, info });

    if (err || !user) {
      console.log("❌ JwtAuthGuard FAILING → returning 401");
      throw err || new UnauthorizedException("Invalid or missing token");
    }

    console.log("✅ JwtAuthGuard SUCCESS → user authenticated");
    return user;
  }
}
