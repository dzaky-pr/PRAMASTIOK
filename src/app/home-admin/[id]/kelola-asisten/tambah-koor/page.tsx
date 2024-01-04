'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import ButtonLink from '@/components/links/ButtonLink';
import Loading from '@/components/Loading';
import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import MainLayout from '@/layouts/MainLayout';

import { ApiError, ApiReturn } from '@/types/api';

type User = {
  role_id: number;
  nama: string;
  nrp: string;
  role_name: string;
};

type TambahKoor = {
  nrpList: Array<string>;
};

export default withAuth(TambahKoor, ['admin']);

function TambahKoor({ params }: { params: { id: string } }) {
  const token = getAccessToken();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [dataKoor, setDataKoor] = React.useState<User[]>([]);

  const LoadKoor = React.useCallback(async () => {
    const res = await api.get<ApiReturn<User[]>>(`/role/${params.id}`, {
      headers: {
        Authorization: token,
      },
    });
    if (!res.data.data) {
      return;
    }
    setLoading(false);
    return setDataKoor(res.data.data);
  }, [params.id, token]);

  React.useEffect(() => {
    LoadKoor();
  }, [LoadKoor]);

  const methods = useForm<TambahKoor>({
    mode: 'onTouched',
  });

  const { register, handleSubmit } = methods;

  const { mutate: RegistMutation, isPending } = useMutation<
    void,
    AxiosError<ApiError>,
    TambahKoor
  >({
    mutationFn: async (data) => {
      const res = await api.post(`/role/${params.id}/koor`, data, {
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
      router.refresh();
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const onSubmit: SubmitHandler<TambahKoor> = (data) => {
    RegistMutation({
      nrpList: Array.isArray(data.nrpList) ? data.nrpList : [data.nrpList],
    });
  };

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Tambah Koordinator'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          <FormProvider {...methods}>
            <form
              action='#'
              onSubmit={handleSubmit(onSubmit)}
              className='bg-darkGrey-800 container mx-auto w-screen rounded-3xl border border-orange-600 p-6'
            >
              <div className=' flex w-full flex-col gap-3'>
                <div className='flex flex-col gap-1.5'>
                  <h3>NRP</h3>
                  <input
                    {...register('nrpList', {
                      required: true,
                    })}
                    type='string'
                    name='nrpList'
                    id='nrpList'
                    className='w-full rounded-full border border-orange-600 bg-transparent px-4 py-2 font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                    placeholder='5024xxxxxx'
                  />
                </div>
                <div className='flex justify-end'>
                  <Button
                    isLoading={isPending}
                    type='submit'
                    className='flex w-fit  rounded-xl border-none bg-black px-6 text-orange-600'
                  >
                    Tambah
                  </Button>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-1.5'>
                  <h3>Koordinator</h3>
                  <div className='w-full table-fixed  rounded-3xl border border-orange-600 p-6 text-center'>
                    {loading && <Loading />}
                    {!loading &&
                      dataKoor.map((e) => {
                        if (e.role_name === 'koordinator') {
                          return (
                            <div
                              key={e.role_id}
                              className='flex flex-row justify-between gap-6 px-32'
                            >
                              <td className='p-2 text-start'>{e.nama}</td>
                              <td className='p-2 text-end'>{e.nrp}</td>
                            </div>
                          );
                        } else {
                          return null; // Jika bukan koordinator, jangan tampilkan apa-apa
                        }
                      })}
                  </div>
                </div>

                <div className='flex justify-end'>
                  <ButtonLink
                    href={`/home-admin/${params.id}/kelola-asisten`}
                    className='w-fit rounded-xl  border-none bg-black px-6 text-orange-600'
                  >
                    Simpan
                  </ButtonLink>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </MainLayout>
  );
}
