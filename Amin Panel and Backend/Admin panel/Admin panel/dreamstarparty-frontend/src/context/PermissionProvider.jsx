import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS, buildPermissionMap, canDo, canSeeModule } from '../util/permissions';

const PermissionCtx = createContext({
  can: () => false,
  canSee: () => false,
  refresh: () => {},
});

export function PermissionProvider({ children }) {
  const readFromSession = () => {
    try {
      let lt = sessionStorage.getItem(STORAGE_KEYS.loginType) || '';
      const raw = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.permissions) || '[]');
      const token = sessionStorage.getItem('TOKEN');
      if (!lt && token) {
        lt = 'ADMIN';
      }
      return { lt, pm: buildPermissionMap(raw) };
    } catch {
      return { lt: undefined, pm: buildPermissionMap([]) };
    }
  };

  const [{ lt, pm }, setState] = useState(() => readFromSession());

  const refresh = () => setState(readFromSession());

  const isElevated =
    String(lt || '').toUpperCase() === 'ADMIN' ||
    String(lt || '').toUpperCase() === 'SUPER_ADMIN';

  useEffect(() => {
    const onStorage = (e) => {
      if (
        e.storageArea === sessionStorage &&
        [STORAGE_KEYS.loginType, STORAGE_KEYS.permissions].includes(e.key || '')
      ) {
        refresh();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({
      loginType: lt,
      permissionMap: pm,
      can: (moduleName, action) =>
        isElevated ? true : canDo(lt, pm, moduleName, action),
      canSee: (moduleName) => (isElevated ? true : canSeeModule(lt, pm, moduleName)),
      refresh,
    }),
    [lt, pm, isElevated]
  );

  return (
    <PermissionCtx.Provider value={value}>{children}</PermissionCtx.Provider>
  );
}

export const usePermission = () => useContext(PermissionCtx);
