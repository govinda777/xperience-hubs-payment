export interface AuthUser {
  id: string;
  privyId: string;
  walletAddress: string;
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface LoginRequest {
  walletAddress?: string;
  email?: string;
  socialProvider?: 'google' | 'facebook' | 'twitter' | 'apple';
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface LogoutResult {
  success: boolean;
  error?: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResult {
  valid: boolean;
  user?: AuthUser;
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface IAuthService {
  /**
   * Login user with various methods
   */
  login(request: LoginRequest): Promise<LoginResult>;

  /**
   * Logout current user
   */
  logout(): Promise<LogoutResult>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<AuthUser | null>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Validate access token
   */
  validateToken(request: ValidateTokenRequest): Promise<ValidateTokenResult>;

  /**
   * Refresh access token
   */
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResult>;

  /**
   * Get access token
   */
  getAccessToken(): string | null;

  /**
   * Set access token
   */
  setAccessToken(token: string): void;

  /**
   * Clear authentication data
   */
  clearAuth(): void;

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<AuthUser>): Promise<AuthUser>;

  /**
   * Link wallet to user account
   */
  linkWallet(walletAddress: string): Promise<boolean>;

  /**
   * Unlink wallet from user account
   */
  unlinkWallet(walletAddress: string): Promise<boolean>;
}