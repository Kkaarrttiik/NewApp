import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../context/PermissionProvider';

const RequireModulePermission = ({ module, children }) => {
  const { canSee } = usePermission();

  if (!module || !canSee(module)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequireModulePermission;

