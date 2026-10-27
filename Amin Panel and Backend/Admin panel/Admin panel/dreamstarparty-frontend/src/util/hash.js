import { STORAGE_KEYS } from "./permissions";

const SECRET_TOKEN = "secret_token";

/**
 * Creates a simple hash from a string using a secret token.
 * This is used to verify the integrity of data in sessionStorage and localStorage.
 */
export const createHash = (data) => {
  const str = JSON.stringify(data) + SECRET_TOKEN;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

/**
 * Validates the current login data against a stored hash.
 */
export const validateLoginData = () => {
  const loginType = sessionStorage.getItem(STORAGE_KEYS.loginType);
  const permissions = sessionStorage.getItem(STORAGE_KEYS.permissions);
  const flag = sessionStorage.getItem(STORAGE_KEYS.flag);
  const localLoginType = localStorage.getItem(STORAGE_KEYS.loginType);
  const localPermissions = localStorage.getItem(STORAGE_KEYS.permissions);
  const localFlag = localStorage.getItem(STORAGE_KEYS.flag);
  const storedHash = localStorage.getItem("auth_hash");

  // Not logged in yet or partially logged out
  if (!loginType || !permissions || flag === null) return true; 

  // Verify that localStorage matches sessionStorage to prevent independent tampering
  if (localLoginType && localLoginType !== loginType) return false;
  if (localPermissions && localPermissions !== permissions) return false;
  if (localFlag && localFlag !== flag) return false;

  const currentHash = createHash({ loginType, permissions, flag });

  if (storedHash && storedHash !== currentHash) {
    return false; // Integrity check failed
  }

  return true;
};
