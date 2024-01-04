'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'react-toastify';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import useAuthStore from '@/stores/useAuthStore';

import Loading from '../Loading';

import { ApiResponse } from '@/types/api';
import { PermissionList } from '@/types/entities/permission-list';
import { User } from '@/types/entities/user';

async function getUser() {
  const res = await api.get<ApiResponse<User>>('/user/profile');
  return res.data.data;
}

type WithAuthProps = {
  user: User;
};

export default function withAuth<T>(
  Component: React.ComponentType<T>,
  permissions: PermissionList
) {
  function ComponentWithAuth(props: Omit<T, keyof WithAuthProps>) {
    const router = useRouter();

    const { user, isAuthenticated, isLoading, login, logout, stopLoading } =
      useAuthStore();

    const checkAuth = React.useCallback(async () => {
      const token = getAccessToken();
      if (!token) {
        isAuthenticated && logout();
        stopLoading();
        return;
      }

      if (isAuthenticated) {
        stopLoading();
        return;
      }

      try {
        const newUser = await getUser();
        login({ ...newUser, token });
      } catch {
        logout();
      } finally {
        stopLoading();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    React.useEffect(() => {
      if (window.sessionStorage.getItem('redirected')) {
        window.sessionStorage.removeItem('redirected');
        return;
      }

      if (
        isLoading ||
        permissions.includes('all') ||
        (permissions.includes('authed') && isAuthenticated)
      ) {
        return;
      }

      if (
        !isAuthenticated ||
        (user && !permissions.every((p) => user.roles.includes(p)))
      ) {
        router.replace('/login');
        toast.error('Anda tidak memiliki akses ke halaman ini');
        window.sessionStorage.setItem('redirected', 'true');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isLoading]);

    React.useEffect(() => {
      checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <Loading />;
    return <Component {...(props as T)} user={user} />;
  }

  return ComponentWithAuth;
}
