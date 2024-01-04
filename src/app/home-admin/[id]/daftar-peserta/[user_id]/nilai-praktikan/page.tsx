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
import Loading from '@/components/Loading';
import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import MainLayout from '@/layouts/MainLayout';

import { ApiError, ApiReturn } from '@/types/api';

// eslint-disable-next-line unused-imports/no-unused-vars
type UserOnly = {
  nama: string;
  nrp: string;
};

type ModulProps = {
  id_modul: string;
  nama_modul: string;
  nilai_modul: string;
};

type UserNilai = {
  user_id: number;
  peserta: UserOnly;
  modul: ModulProps[];
};

export default withAuth(NilaiPraktikan, ['admin']);
function NilaiPraktikan({
  params,
}: {
  params: { id: number; user_id: string };
}) {
  const token = getAccessToken();
  const [queryUser, setQueryUser] = React.useState<UserNilai>();
  const [loading, setLoading] = React.useState(true);
  const [selectedModulIndex, setSelectedModulIndex] = React.useState<
    number | null
  >(null);

  const handleModulClick = (index: number) => {
    setSelectedModulIndex(index);
  };

  const LoadDataNilai = React.useCallback(async () => {
    const res = await api.get<ApiReturn<UserNilai>>(
      `/nilai/${params.id}/peserta/${params.user_id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!res.data.data) {
      return;
    }
    setLoading(false);
    return setQueryUser(res.data.data);
  }, [params.id, params.user_id, token]);

  React.useEffect(() => {
    LoadDataNilai();
  }, [LoadDataNilai]);

  const methods = useForm<ModulProps>({
    mode: 'onTouched',
  });

  const { register, handleSubmit } = methods;
  const router = useRouter();

  const { mutate: RegistMutation, isPending } = useMutation<
    void,
    AxiosError<ApiError>,
    ModulProps
  >({
    mutationFn: async (data) => {
      const res = await api.put(
        `/nilai/${params.id}/peserta/${params.user_id}?semester&tahun_akademik`,
        data,
        {
          toastify: true,
        }
      );

      if (res.data) {
        showToast('Berhasil nilai modul!', SUCCESS_TOAST);
      } else if (!res.data) {
        showToast('Gagal nilai modul!', DANGER_TOAST);
        throw new Error('Gagal nilai modul!');
      } else {
        showToast('Gagal nilai modul!', DANGER_TOAST);
        throw new Error('Gagal nilai modul!');
      }
      setSelectedModulIndex(null);
      router.push(`/home-admin/${params.id}/daftar-peserta`);
    },

    onSuccess: () => {
      router.push(`/home-admin/${params.id}/daftar-peserta`);
    },
  });

  const onSubmit: SubmitHandler<ModulProps> = (data) => {
    RegistMutation({
      id_modul: data.id_modul,
      nilai_modul: data.nilai_modul,
      nama_modul: data.nama_modul, // Add this line
    });
  };

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Nilai Praktikan'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          <div className='bg-darkGrey-800 container mx-auto flex w-screen flex-col gap-6 rounded-3xl border border-orange-600 p-6'>
            <div className=' flex w-full flex-col gap-1.5'>
              <h3>Nama</h3>
              <div className='w-full rounded-full border border-orange-600 px-4 py-2'>
                {queryUser?.peserta?.nama}
              </div>
            </div>

            <div className=' flex w-full flex-col gap-1.5'>
              <h3>NRP</h3>
              <div className='w-full rounded-full border border-orange-600 px-4 py-2'>
                {queryUser?.peserta?.nrp}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2'>
                <h3>Nilai</h3>
                {loading && <Loading />}
                {!loading && queryUser?.modul.length === 0 && (
                  <p className='mt-12 flex w-full items-center justify-center font-semibold text-orange-600'>
                    Tidak ada modul yang diambil
                  </p>
                )}

                {queryUser?.modul.map((e, index) => (
                  <React.Fragment key={index}>
                    {selectedModulIndex === index ? (
                      <FormProvider {...methods}>
                        <form
                          action='#'
                          onSubmit={handleSubmit(onSubmit)}
                          className=''
                        >
                          <div className=''>
                            <h3>{e.nama_modul}</h3>
                            <div className='flex flex-row gap-2'>
                              <input
                                {...register('id_modul')}
                                value={e.id_modul}
                                hidden
                              />

                              <input
                                {...register('nilai_modul')}
                                className='w-full rounded-full border border-orange-600 bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                                placeholder='Masukkan nilai ...'
                              />
                              <Button
                                isLoading={isPending}
                                type='submit'
                                className='w-[120px] rounded-xl  border-none bg-black px-4 text-orange-600'
                              >
                                Input nilai
                              </Button>
                            </div>
                          </div>
                        </form>
                      </FormProvider>
                    ) : (
                      <Button
                        onClick={() => handleModulClick(index)}
                        variant='ghost'
                        className='flex flex-col items-start gap-4 p-0 text-orange-600 '
                      >
                        <h3>{e.nama_modul}</h3>
                        <input
                          type='number'
                          name={`praktikum_${index}`}
                          id={`praktikum_${index}`}
                          className='w-full rounded-full border border-orange-600 bg-transparent px-4 font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                          value={e.nilai_modul}
                          required
                        />
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* <div className='mt-6 flex justify-end'>
                <ButtonLink
                  href={`/home-admin/${params.id}/daftar-peserta`}
                  className='w-fit rounded-xl  border-none bg-black px-6 text-orange-600 '
                >
                  Selesai
                </ButtonLink>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
