export interface SuperuserAuthResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    avatar?: string;
  };
}

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function superuserSignIn(email: string, password: string): Promise<SuperuserAuthResponse> {
  const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Failed to sign in as superuser');
  }

  const data: SuperuserAuthResponse = await response.json();
  if (typeof window !== 'undefined') {
    localStorage.setItem('pocketbase_superuser_token', data.token);
  }
  return data;
}

export function superuserSignOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pocketbase_superuser_token');
  }
}

export async function validateSuperuserToken(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('pocketbase_superuser_token');
  if (!token) {
    return false;
  }

  const response = await fetch(`${POCKETBASE_URL}/api/admins/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  });

  if (!response.ok) {
    superuserSignOut();
    return false;
  }

  const data: SuperuserAuthResponse = await response.json();
  if (data.token) {
    localStorage.setItem('pocketbase_superuser_token', data.token);
    return true;
  }

  return false;
}
