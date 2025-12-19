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

    // No @Roles decorator at all → public endpoint, allow
    if (requiredRoles === undefined) {
      console.log("No @Roles decorator → ALLOW");
      return true;
    }

    // @Roles() with empty array → requires authentication but any role is allowed
    if (requiredRoles.length === 0) {
      console.log("Empty @Roles() → Any authenticated user allowed");
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

    // Special case: Check for JOB_CANDIDATE role
    // Candidates have userType: 'candidate' and empty roles array
    const isCandidate = user?.userType === 'candidate' || 
      (Array.isArray(user?.roles) && user.roles.length === 0);
    const requiresCandidate = required.includes('job candidate');
    
    if (requiresCandidate && isCandidate) {
      console.log("✔ Candidate access granted (userType check)");
      return true;
    }

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
