// Simple auth utility without React Context
// Handles authentication checks using cookies

export interface User {
  id: string;
  workEmail: string;
  roles: string[];
  permissions: string[];
  primaryDepartmentId?: string;
  employeeNumber: string;
  firstName?: string;
  lastName?: string;
}

// Check if user is authenticated by calling /auth/me
export async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch('http://localhost:5000/auth/me', {
      credentials: 'include',
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// Check if user has a specific role
export function hasRole(user: User | null, role: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}

// Check if user has a specific permission
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

// Logout user
export async function logout(): Promise<void> {
  try {
    await fetch('http://localhost:5000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/login';
  }
}