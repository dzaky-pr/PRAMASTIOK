import Cookies from 'universal-cookie';

const accessCookies = new Cookies();
export const getAccessToken = (): string => {
  return accessCookies.get('@pramasti/accessToken');
};

export const setAccessToken = (token: string) => {
  accessCookies.set('@pramasti/accessToken', token, {
    path: '/',
  });
};

export const removeAccessToken = () => {
  accessCookies.remove('@pramasti/accessToken', {
    path: '/',
  });
};

const refreshCookies = new Cookies();

export const getRefreshToken = (): string => {
  return refreshCookies.get('@pramasti/refreshToken');
};

export const setRefreshToken = (token: string) => {
  refreshCookies.set('@pramasti/refreshToken', token, {
    path: '/',
  });
};

export const removeRefreshToken = () => {
  refreshCookies.remove('@pramasti/refreshToken', {
    path: '/',
  });
};
