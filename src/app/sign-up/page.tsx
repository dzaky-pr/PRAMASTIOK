'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import api from '@/lib/api';

import Button from '@/components/buttons/Button';
import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import MainLayout from '@/layouts/MainLayout';

type SignupForm = {
  nama: string;
  nrp: string;
  email: string;
  password: string;
  nohp: string;
  departemen: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const methods = useForm<SignupForm>({
    mode: 'onTouched',
  });

  const { register, handleSubmit } = methods;

  const { mutateAsync: signupMutation, isPending } = useMutation<
    void,
    AxiosError<ApiError>,
    SignupForm
  >({
    mutationFn: async (data) => {
      const res = api.post('/user/signup', data, {
        toastify: true,
      });

      if ((await res).data.data) {
        showToast('Berhasil buat akun!', SUCCESS_TOAST);
      } else if (!(await res).data.data) {
        showToast('Registrasi gagal!', DANGER_TOAST);
        throw new Error('Registrasi gagal');
      }
    },
    onSuccess: () => router.push('/login'),
  });

  const onSubmit = (data: SignupForm) => signupMutation(data);

  return (
    <MainLayout
      withNavbar={false}
      withTitle={false}
      withDropdown={false}
      withRightNav={false}
      withBackButton={false}
      className='overflow-y-auto'
    >
      <section className='bg-darkGrey-800 relative flex h-screen w-screen items-center justify-center overflow-y-auto'>
        <NextImage
          src='/images/signup/top_left_decor.png'
          width={146}
          height={150}
          alt='top left decoration'
          className='absolute left-20 top-20 h-[20%] w-auto'
        />

        <NextImage
          src='/images/signup/bottom_left_decor.png'
          width={375}
          height={386}
          alt='bottom left decoration'
          className='absolute bottom-0 left-0 h-[20%] w-auto'
        />

        <NextImage
          src='/images/signup/top_right_decor.png'
          width={236}
          height={243}
          alt='top right decoration'
          className='absolute right-40 top-0 h-[15%] w-auto'
        />

        <NextImage
          src='/images/signup/mid_right_decor.png'
          width={249}
          height={367}
          alt='mid right decoration'
          className='absolute inset-y-0 right-0 top-24 h-[55%] w-auto'
        />

        <div className='absolute z-20 flex h-full w-[560px] flex-col items-center justify-center'>
          <FormProvider {...methods}>
            <h1 className='text-center text-orange-600'>SIGN UP</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex w-full flex-col items-center justify-center gap-4'
            >
              <div className='flex w-full flex-row items-center justify-center gap-4'>
                <NextImage
                  src='/images/signup/people.png'
                  width={38}
                  height={38}
                  alt='people'
                  className='h-[55%] w-auto'
                />

                <input
                  {...register('nama', {
                    required: true,
                  })}
                  type='text'
                  id='nama'
                  className='bg-darkGrey-800 w-full border-x-0 border-b-2 border-t-0 border-yellow-100 pl-0 pr-4 pt-4 font-semibold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60 focus:border-yellow-600 focus:ring-0'
                  placeholder='Nama'
                />
              </div>

              <div className='flex w-full flex-row items-center justify-center gap-4'>
                <NextImage
                  src='/images/signup/2people.png'
                  width={40}
                  height={35}
                  alt='people'
                  className='h-[55%] w-auto'
                />

                <input
                  {...register('nrp', {
                    required: true,
                  })}
                  type='number'
                  id='nrp'
                  className='bg-darkGrey-800 w-full border-x-0 border-b-2 border-t-0 border-yellow-100 pl-0 pr-4 pt-4 font-semibold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60 focus:border-yellow-600 focus:ring-0'
                  placeholder='NRP'
                />
              </div>

              <div className='flex w-full flex-row items-center justify-center gap-4'>
                <NextImage
                  src='/images/signup/bucket.png'
                  width={37}
                  height={37}
                  alt='bucket'
                  className='h-[55%] w-auto'
                />

                <input
                  {...register('departemen', {
                    required: true,
                  })}
                  type='text'
                  id='departemen'
                  className='bg-darkGrey-800 w-full border-x-0 border-b-2 border-t-0 border-yellow-100 pl-0 pr-4 pt-4 font-semibold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60 focus:border-yellow-600 focus:ring-0'
                  placeholder='Departemen'
                />
              </div>

              <div className='flex w-full flex-row items-center justify-center gap-4'>
                <NextImage
                  src='/images/signup/square.png'
                  width={35}
                  height={35}
                  alt='square'
                  className='h-[55%] w-auto'
                />
                <input
                  {...register('nohp', {
                    required: true,
                  })}
                  type='number'
                  id='nohp'
                  className='bg-darkGrey-800 w-full border-x-0 border-b-2 border-t-0 border-yellow-100 pl-0 pr-4 pt-4 font-semibold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60 focus:border-yellow-600 focus:ring-0'
                  placeholder='Whatsapp'
                />
              </div>

              <div className='flex w-full flex-row items-center justify-center gap-4'>
                <NextImage
                  src='/images/signup/message.png'
                  width={34}
                  height={35}
                  alt='message'
                  className='h-[55%] w-auto'
                />
                <input
                  {...register('email', {
                    required: true,
                  })}
                  type='email'
                  id='email'
                  placeholder='Email'
                  className=' bg-darkGrey-800 w-full border-x-0 border-b-2 border-t-0 border-yellow-100  pl-0 pr-4 pt-4 font-semibold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60 focus:border-yellow-600 focus:ring-0'
                />
              </div>

              <div className='flex w-full flex-row items-center justify-center gap-4'>
                <NextImage
                  src='/images/signup/locked.png'
                  width={33}
                  height={38}
                  alt='locked'
                  className='h-[55%] w-auto'
                />
                <input
                  {...register('password', {
                    required: true,
                  })}
                  type='password'
                  id='password'
                  placeholder='Password'
                  className=' bg-darkGrey-800 w-full border-x-0 border-b-2 border-t-0 border-yellow-100  pl-0 pr-4 pt-4 font-semibold text-yellow-600 placeholder:text-yellow-600 placeholder:opacity-60 focus:border-yellow-600 focus:ring-0'
                />
              </div>

              <div className='flex w-full items-end justify-end'>
                <Button
                  type='submit'
                  isLoading={isPending}
                  className=' w-fit items-center justify-end rounded-2xl border-none bg-black px-6 py-4 text-center font-bold text-yellow-600'
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </MainLayout>
  );
}
