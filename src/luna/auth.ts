const EXPECTED_EMAIL_HASH = 'f5e986a98ef7cb58ce2c569a935ea72266142efe2b8427ccdb6889a7d90b33d8';
const EXPECTED_PASSWORD_HASH = 'e029ae8717c5dc2dfeb43ae4fe52147d5e30d3946374152c365f723f291664d7';
const SESSION_KEY = 'luna.session';
const SESSION_TOKEN = '7a3f1c9e0d4b8265';

export const sha256Hex = async (input: string): Promise<string> => {
  const buf = new TextEncoder().encode(input);
  const hash = await window.crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const verifyCredentials = async (email: string, password: string): Promise<boolean> => {
  const e = await sha256Hex(email.trim().toLowerCase());
  const p = await sha256Hex(password);
  return e === EXPECTED_EMAIL_HASH && p === EXPECTED_PASSWORD_HASH;
};

const sessionValue = async () => sha256Hex(SESSION_TOKEN);

export const setLoggedIn = async () => {
  try {
    sessionStorage.setItem(SESSION_KEY, await sessionValue());
  } catch {}
};

export const isLoggedIn = (): boolean => {
  try {
    return !!sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
};

export const logout = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
};