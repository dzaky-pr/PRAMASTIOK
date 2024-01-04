'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import { ModulType } from '@/app/home-admin/[id]/kelola-modul/page';
import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

type BuatJadwalPraktikumType = {
  judul_modul: string;
  start_tgl: string | Date;
  start_wkt: string | Date;
  kuota: number;
};

export default withAuth(BuatJadwalpraktikan, ['admin']);

function BuatJadwalpraktikan({ params }: { params: { id: string } }) {
  const methods = useForm<BuatJadwalPraktikumType>({
    mode: 'onTouched',
  });

  const { register, handleSubmit } = methods;
  const router = useRouter();

  const { mutate: post } = useMutation<
    void,
    AxiosError<ApiError>,
    BuatJadwalPraktikumType
  >({
    mutationFn: async (data) => {
      try {
        const res = await api.post(
          `/praktikum/${params.id}/modul/jadwal`,
          data,
          {
            toastify: true,
          }
        );

        if (res.data) {
          showToast('Berhasil !', SUCCESS_TOAST);
        } else if (!res.data) {
          showToast('Gagal !', DANGER_TOAST);
          throw new Error('Gagal !');
        } else {
          showToast('Gagal !', DANGER_TOAST);
          throw new Error('Gagal !');
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert((error as any).response.data.message);
      }
    },
    onSuccess: () => {
      alert('Berhasil membuat jadwal praktikum');
      router.push(`/home-admin/${params.id}/daftar-jadwal-praktikum`);
    },
  });

  const onSubmit: SubmitHandler<BuatJadwalPraktikumType> = (data) =>
    post({
      judul_modul: data.judul_modul,
      start_tgl: data.start_tgl,
      start_wkt: data.start_wkt + ':00',
      kuota: data.kuota,
    });

  const token = getAccessToken();
  const [dataJadwal, setDataJadwal] = React.useState<ModulType[]>();
  const LoadDaftarJadwal = React.useCallback(async () => {
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
    return setDataJadwal(res.data.data);
  }, [params.id, token]);

  React.useEffect(() => {
    LoadDaftarJadwal();
  }, [LoadDaftarJadwal]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Buat Jadwal Praktikum'
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
                  <h3>Judul Modul</h3>
                  <select
                    {...register('judul_modul', {
                      required: true,
                    })}
                    name='judul_modul'
                    id='judul_modul'
                    className='bg-darkGrey-800'
                    placeholder='Masukkan judul modul...'
                  >
                    {dataJadwal?.map((jadwal) => {
                      return (
                        <option
                          value={jadwal.judul_modul}
                          key={jadwal.id_modul}
                        >
                          {jadwal.judul_modul}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className='flex flex-col gap-1.5'>
                  <h3>Tanggal</h3>
                  <input
                    {...register('start_tgl', {
                      required: true,
                    })}
                    type='date'
                    name='start_tgl'
                    id='start_tgl'
                    className='w-full rounded-full border border-orange-600 bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <h3>Kuota persesi</h3>
                  <input
                    {...register('kuota', {
                      required: true,
                    })}
                    type='number'
                    name='kuota'
                    id='kuota'
                    className='w-full rounded-full border border-orange-600 bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                    placeholder='Masukkan kuota persesi...'
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <h3>Jam Sesi</h3>
                  <input
                    {...register('start_wkt', {
                      required: true,
                    })}
                    type='text'
                    name='start_wkt'
                    id='start_wkt'
                    className='w-full rounded-full border border-orange-600 bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                    placeholder='Contoh 16:30'
                  />
                </div>
              </div>

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  className='mt-4 w-fit rounded-xl border-none bg-black px-6 text-orange-600'
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
