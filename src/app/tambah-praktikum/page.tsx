'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import api from '@/lib/api';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import MainLayout from '@/layouts/MainLayout';

import { ApiError } from '@/types/api';

type TambahPraktikum = {
  praktikum_name: string;
  deskripsi: string;
};

export default withAuth(TambahPraktikum, ['admin']);
function TambahPraktikum() {
  const methods = useForm<TambahPraktikum>({
    mode: 'onTouched',
  });

  const { register, handleSubmit } = methods;
  const router = useRouter();

  const { mutate: RegistMutation, isPending } = useMutation<
    void,
    AxiosError<ApiError>,
    TambahPraktikum
  >({
    mutationFn: async (data) => {
      const res = await api.post('/praktikum/add', data, {
        toastify: true,
      });

      if (res.data) {
        showToast('Berhasil buat praktikum!', SUCCESS_TOAST);
      } else if (!res.data) {
        showToast('Gagal buat praktikum!', DANGER_TOAST);
        throw new Error('Gagal buat praktikum!');
      } else {
        showToast('Gagal buat praktikum!', DANGER_TOAST);
        throw new Error('Gagal buat praktikum!');
      }
    },
    onSuccess: () => {
      router.push('/home-admin');
    },
  });

  const onSubmit: SubmitHandler<TambahPraktikum> = (data) =>
    RegistMutation({
      praktikum_name: data.praktikum_name,
      deskripsi: data.deskripsi,
    });

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Tambah Praktikum'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          <FormProvider {...methods}>
            <form
              action='#'
              onSubmit={handleSubmit(onSubmit)}
              className='bg-darkGrey-800 container mx-auto flex w-screen flex-col gap-6 rounded-3xl border border-orange-600 p-6'
            >
              <div className=' flex w-full flex-col gap-3'>
                <div className='flex flex-col gap-1.5'>
                  <h3>Judul</h3>
                  <input
                    {...register('praktikum_name', {
                      required: true,
                    })}
                    type='text'
                    name='praktikum_name'
                    id='praktikum_name'
                    className='w-full rounded-lg border border-orange-600 bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                    placeholder='Masukkan judul ...'
                    required
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <h3>Deskripsi</h3>
                  <textarea
                    {...register('deskripsi', {
                      required: true,
                    })}
                    name='deskripsi'
                    id='deskripsi'
                    rows={8}
                    className='w-full rounded-lg border border-orange-600 bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                    placeholder='Masukkan deskripsi ...'
                    required
                  ></textarea>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button
                  isLoading={isPending}
                  type='submit'
                  className='w-fit rounded-xl  border-none bg-black px-6 text-orange-600'
                >
                  Kirim
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </MainLayout>
  );
}
