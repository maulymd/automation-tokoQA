import { type APIRequestContext } from '@playwright/test';

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    username: string;
    name: string;
    role: 'customer' | 'admin';
  };
}

/**
 * AuthApi — Helper class for TokoQA Authentication API
 */
export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Login via API and return token + user info.
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await this.request.post('/api/login', {
      data: { username, password },
    });

    if (!res.ok()) {
      const errorBody = await res.text();
      throw new Error(`API Login failed with status ${res.status()}: ${errorBody}`);
    }

    return (await res.json()) as LoginResponse;
  }
}
