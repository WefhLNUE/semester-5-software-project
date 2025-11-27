import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("🔥 RolesGuard running!");

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    console.log("\n===== ROLE GUARD =====");
    console.log("Required roles:", requiredRoles);

    if (!requiredRoles) {
      console.log("No roles required → ALLOW");
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log("User object:", user);

    if (!user) {
      console.log("❌ No user in request → 401");
      return false;
    }

    // Make roles case insensitive
    const userRoles = (user.roles || []).map(r => r.toLowerCase());
    const required = requiredRoles.map(r => r.toLowerCase());

    console.log("Normalized user roles:", userRoles);
    console.log("Normalized required roles:", required);

    const hasRole = required.some(role => userRoles.includes(role));

    console.log("Has required role?", hasRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `You do not have permission. Needed: ${requiredRoles}, you have: ${user.roles}`
      );
    }

    console.log("✔ ACCESS GRANTED ✔");
    return true;
  }
}
