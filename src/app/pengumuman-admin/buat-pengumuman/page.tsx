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

type BuatPengumuman = {
  judul: string;
  deskripsi: string;
};

export default withAuth(BuatPengumuman, ['admin']);
function BuatPengumuman() {
  const methods = useForm<BuatPengumuman>({
    mode: 'onTouched',
  });

  const { register, handleSubmit } = methods;
  const router = useRouter();

  const { mutate: RegistMutation, isPending } = useMutation<
    void,
    AxiosError<ApiError>,
    BuatPengumuman
  >({
    mutationFn: async (data) => {
      const res = await api.post('/pengumuman/add', data, {
        toastify: true,
      });

      if (res.data) {
        showToast('Berhasil buat pengumuman!', SUCCESS_TOAST);
      } else if (!res.data) {
        showToast('Gagal buat pengumuman!', DANGER_TOAST);
        throw new Error('Gagal buat pengumuman!');
      } else {
        showToast('Gagal buat pengumuman!', DANGER_TOAST);
        throw new Error('Gagal buat pengumuman!');
      }
    },
    onSuccess: () => {
      router.push('/pengumuman-admin');
    },
  });

  const onSubmit: SubmitHandler<BuatPengumuman> = (data) =>
    RegistMutation({
      judul: data.judul,
      deskripsi: data.deskripsi,
    });

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Buat Pengumuman'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          <FormProvider {...methods}>
            <form
              action='#'
              onSubmit={handleSubmit(onSubmit)}
              className='bg-darkGrey-800 container mx-auto flex w-screen flex-col gap-6 rounded-3xl border border-orange-600 p-6'
            >
              <div className=' flex w-full flex-col gap-1.5'>
                <h3>Judul</h3>
                <input
                  {...register('judul', {
                    required: true,
                  })}
                  type='text'
                  name='judul'
                  id='judul'
                  className='w-full rounded-full border border-orange-600 bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                  placeholder='Masukkan judul pengumuman...'
                  required
                />
              </div>

              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-1.5'>
                  <h3>Deskripsi</h3>
                  <textarea
                    {...register('deskripsi', {
                      required: true,
                    })}
                    required
                    placeholder='Masukkan deskripsi pengumuman...'
                    name='deskripsi'
                    id='deskripsi'
                    rows={16}
                    className='rounded-3xl border border-orange-600 bg-transparent placeholder:text-orange-600 placeholder:opacity-60 focus:border-2 focus:border-orange-600'
                  ></textarea>
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
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </MainLayout>
  );
}
