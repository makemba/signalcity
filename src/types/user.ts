
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  metadata?: {
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    preferences?: {
      theme: 'light' | 'dark' | 'system';
      language: string;
    };
  };
}

export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';

export interface UserSession {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: string;
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
}

export interface UserWithPermissions extends User {
  permissions: UserPermission[];
}

export interface AdminImpersonation {
  originalUserId: string;
  impersonatedUser: User;
  timestamp: string;
}
