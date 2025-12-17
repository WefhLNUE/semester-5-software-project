import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log("🔥 JwtAuthGuard: canActivate CALLED");

    // Check if @Roles decorator is present
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If @Roles decorator is not present at all (undefined), this is a public endpoint
    // If @Roles() is present (even with empty array), authentication is required
    if (requiredRoles === undefined) {
      console.log("✅ JwtAuthGuard: No @Roles decorator → PUBLIC ENDPOINT, skipping auth");
      return true;
    }

    console.log("🔐 JwtAuthGuard: @Roles found, requiring authentication");
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    console.log("🔥 JwtAuthGuard: handleRequest()", { err, user, info });

    if (err) {
      console.error("❌ JwtAuthGuard ERROR:", err.message || err);
      throw new UnauthorizedException(`Authentication error: ${err.message || 'Unknown error'}`);
    }

    if (!user) {
      // Extract detailed error information from 'info' object
      let errorMessage = 'Invalid or missing token';

      if (info) {
        console.error("❌ JwtAuthGuard INFO:", info);

        if (info.name === 'TokenExpiredError') {
          errorMessage = 'Token has expired';
        } else if (info.name === 'JsonWebTokenError') {
          errorMessage = info.message || 'Invalid token format';
        } else if (info.name === 'NotBeforeError') {
          errorMessage = 'Token not yet valid';
        } else if (info.message) {
          errorMessage = info.message;
        }
      } else {
        console.error("❌ JwtAuthGuard: No user found and no info provided");
        errorMessage = 'No token provided';
      }

      console.log(`❌ JwtAuthGuard FAILING → ${errorMessage}`);
      throw new UnauthorizedException(errorMessage);
    }

    console.log("✅ JwtAuthGuard SUCCESS → user authenticated:", user.email || user.id);
    return user;
  }
}
