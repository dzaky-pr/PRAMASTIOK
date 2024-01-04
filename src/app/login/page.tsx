'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import api from '@/lib/api';
import { setAccessToken, setRefreshToken } from '@/lib/cookies';

import Background1 from '@/components/backgrounds/background1';
import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';
import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import useAuthStore from '@/stores/useAuthStore';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';
import { User } from '@/types/entities/user';

type LoginForm = {
  nrp: number;
  password: string;
};

export default function LoginPage() {
  const methods = useForm<LoginForm>({
    mode: 'onTouched',
  });
  const login = useAuthStore.useLogin();
  const { register, handleSubmit } = methods;
  const router = useRouter();

  const { mutate: loginMutation, isPending } = useMutation<
    void,
    AxiosError<ApiError>,
    LoginForm
  >({
    mutationFn: async (data) => {
      const res = await api.post('/user/signin', data, {
        toastify: true,
      });

      if (res.data) {
        showToast('Berhasil login!', SUCCESS_TOAST);
      } else if (!res.data) {
        showToast('Login gagal!', DANGER_TOAST);
        throw new Error('Login gagal');
      } else {
        showToast('Login gagal!', DANGER_TOAST);
        throw new Error('Login gagal');
      }

      const accessToken = res.data.data.accessToken;
      const refreshToken = res.data.data.refreshToken;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      const user = await api.get<ApiReturn<User>>('/user/profile', {
        headers: {
          Authorization: accessToken,
        },
      });

      if (!user.data.data) {
        showToast('Login gagal!', DANGER_TOAST);
        throw new Error('Data user tidak ditemukan');
      }
      login({ ...user.data.data, token: accessToken });

      if (
        user?.data.data?.roles[0] === 'praktikan' &&
        user?.data.data?.roles[1] !== 'asisten'
      ) {
        router.push('/home');
      } else if (
        user?.data.data?.roles[0] === 'praktikan' &&
        user?.data.data?.roles[1] === 'asisten'
      ) {
        router.push('/home-asisten');
      } else if (user?.data.data?.roles[0] === 'admin') {
        router.push('/home-admin');
      }
    },
    onSuccess: () => {
      const user = useAuthStore.useUser();

      if (user?.roles[0] === 'praktikan' && user?.roles[1] === 'asisten') {
        router.push('/home-asisten');
      } else if (user?.roles[0] === 'admin') {
        router.push('/home-admin');
      } else {
        router.push('/home');
      }
    },
  });

  const onSubmit = (data: LoginForm) => loginMutation(data);

  return (
    <MainLayout
      withNavbar={false}
      withTitle={false}
      withDropdown={false}
      withRightNav={false}
      withBackButton={false}
    >
      <section className='bg-darkGrey-800 relative flex h-screen w-screen'>
        <Background1 />

        <div className='absolute inset-0 z-10 flex w-screen flex-col items-center justify-center gap-6'>
          <div className='flex flex-col text-center text-orange-600'>
            <h1 className=''>PRAMASTI</h1>
            <h2 className=''>Praktikum Manajemen Sistem</h2>
          </div>
          <FormProvider {...methods}>
            <div className='bg-lightGrey-400 flex max-w-fit flex-row items-center justify-center gap-8 rounded-full border-none px-20 py-10 shadow-[10px_20px_4px_0px_rgba(0,0,0,0.25)]'>
              <form
                action='#'
                className='flex h-full w-full flex-row gap-8'
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className='flex h-full w-full flex-col gap-8'>
                  <div className='bg-darkGrey-800 flex h-full flex-row items-center justify-center gap-2 rounded-2xl border border-gray-300 px-8 py-2 font-bold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60'>
                    <NextImage
                      src='/images/login/people.png'
                      width={38}
                      height={38}
                      alt='people'
                      className='h-[40%] w-auto'
                    />

                    <input
                      {...register('nrp', {
                        required: true,
                      })}
                      type='number'
                      id='nrp'
                      className='border-none bg-transparent placeholder:text-orange-600 focus:border-none focus:outline-none focus:ring-0 '
                      placeholder='NRP'
                      required
                    />
                  </div>

                  <div className='bg-darkGrey-800 flex h-full w-full flex-row items-center justify-center gap-2 rounded-2xl border border-gray-300 px-8 py-2 font-bold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60'>
                    <NextImage
                      src='/images/login/key.png'
                      width={38}
                      height={38}
                      alt='people'
                      className='h-[40%] w-auto'
                    />

                    <input
                      {...register('password', {
                        required: true,
                      })}
                      required
                      type='password'
                      id='password'
                      placeholder='PASSWORD'
                      className='border-none bg-transparent placeholder:text-orange-600 focus:border-none focus:outline-none focus:ring-0 '
                    />
                  </div>
                </div>

                <span className='bg-lightGrey-600 flex h-full w-8 rounded-full'></span>

                <div className='flex h-full w-full flex-col gap-8'>
                  <ButtonLink
                    href='/sign-up'
                    className='bg-darkGrey-800 w-full items-center justify-center gap-4 rounded-2xl border-none px-2 py-4 text-center font-bold text-yellow-600'
                  >
                    <NextImage
                      src='/images/login/bag.png'
                      width={38}
                      height={38}
                      alt='people'
                      className='h-[40%] w-auto'
                    />
                    SIGN UP
                  </ButtonLink>
                  {/* </div> */}

                  <Button
                    type='submit'
                    isLoading={isPending}
                    className='bg-darkGrey-800 w-full items-center justify-center gap-4 rounded-2xl border-none px-2 py-4 text-center font-bold text-yellow-600'
                  >
                    <NextImage
                      src='/images/login/arrow.png'
                      width={38}
                      height={38}
                      alt='people'
                      className='h-[40%] w-auto'
                    />
                    LOGIN
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </div>
      </section>
    </MainLayout>
  );
}
