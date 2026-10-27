export const STORAGE_KEYS = {
  permissions: 'permissions', // JSON string of RawPermission[]
  loginType: 'loginType', // string
  flag: 'flag' // string
};

export function buildPermissionMap(raw) {
  const map = {};
  (raw ?? []).forEach((p) => {
    map[p.module] = map[p.module] || {};
    (p.actions || []).forEach((a) => {
      map[p.module][a] = true;
    });
  });
  return map;
}

/** super admins bypass checks */
export function canDo(loginType, pm, moduleName, action) {
  if (!loginType) return false;

  const lt = String(loginType).toUpperCase();
  // Any elevated roles get full access here
  if (lt === 'SUPER_ADMIN' || lt === 'ADMIN') return true;

  return !!pm?.[moduleName]?.[action];
}

/** Shortcut to check module visibility (usually "List" is enough to see a page) */
export const canSeeModule = (loginType, pm, moduleName) =>
  canDo(loginType, pm, moduleName, 'List');
