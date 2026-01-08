import { Role } from '@/types/global';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';

export async function getJwtPayload(token: string) {
  try {
    const payload = decodeJwt(token);
    return payload; // contains id, sid, role, iat, exp
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}

// adjust import path

export async function getUserRole(): Promise<Role | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken");

  if (!token) return null;

  try {
    const payload = await getJwtPayload(token.value);

    return payload?.role as Role;
  } catch (err) {
    console.error("Failed to parse JWT:", err);
    return null;
  }
}
