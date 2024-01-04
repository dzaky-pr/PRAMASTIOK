'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import { ModulType } from '@/app/home-admin/[id]/kelola-modul/page';
import MainLayout from '@/layouts/MainLayout';

import { ApiError, ApiReturn } from '@/types/api';

export default withAuth(TambahModul, ['admin']);

type TambahModulType = {
  judulModul: string;
};

function TambahModul({ params }: { params: { id: string } }) {
  const methods = useForm<TambahModulType>({
    mode: 'onTouched',
  });

  const { register, handleSubmit } = methods;
  const router = useRouter();

  const { mutate: AddModul } = useMutation<
    void,
    AxiosError<ApiError>,
    TambahModulType
  >({
    mutationFn: async (data) => {
      const res = await api.post(`/praktikum/${params.id}/modul`, data, {
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
      router.push(`/home-admin/${params.id}/kelola-modul`);
    },
  });

  const onSubmit: SubmitHandler<TambahModulType> = (data) => {
    AddModul({
      judulModul: data.judulModul,
    });
  };

  const token = getAccessToken();

  const [dataModul, setDataModul] = React.useState<ModulType[]>([]);
  const LoadModul = React.useCallback(async () => {
    const res = await api.get<ApiReturn<ModulType[]>>(
      `/praktikum/${params.id}/modul`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (!res.data.data) {
      return;
    }
    return setDataModul(res.data.data);
  }, [params.id, token]);

  React.useEffect(() => {
    LoadModul();
  }, [LoadModul]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Kelola Modul'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='bg-darkGrey-800 container mx-auto mt-6 flex w-screen flex-col gap-6 rounded-3xl border border-orange-600 p-6'
            >
              <div className=' flex w-full flex-col gap-4'>
                <h3>Judul Modul</h3>

                {dataModul.map((modul) => (
                  <input
                    key={modul.id_modul}
                    type='text'
                    name='modul'
                    id='modul'
                    readOnly={true}
                    className='w-full rounded-full border border-orange-600 bg-transparent px-4 py-3 font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                    defaultValue={modul.judul_modul}
                  />
                ))}

                <input
                  {...register('judulModul', {
                    required: true,
                  })}
                  type='text'
                  name='judulModul'
                  id='judulModul'
                  className='w-full rounded-full border border-orange-600 bg-transparent px-4 py-3 font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                  placeholder={`Masukkan modul `}
                  required
                />
              </div>

              {/* <div className='flex justify-end'>
                <button type='submit'>
                  <IconButton
                    variant='dark'
                    className='h-[40px] w-[100px] rounded-full border-none text-orange-600'
                    icon={FaPlus}
                  />
                </button>
              </div> */}
              <div className='mt-12 flex w-full justify-end'>
                <Button
                  type='submit'
                  className='h-[40px] w-[100px] rounded-full  border-none bg-black px-6 text-orange-600'
                >
                  Simpan
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </MainLayout>
  );
}
