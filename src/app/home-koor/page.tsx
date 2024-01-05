'use client';

import * as React from 'react';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Background2 from '@/components/backgrounds/background2';
import withAuth from '@/components/hoc/withAuth';
import ButtonLink from '@/components/links/ButtonLink';
import Loading from '@/components/Loading';
import NextImage from '@/components/NextImage';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

export type PraktikumType = {
  praktikum_id?: number;
  praktikum_name: string;
  deskripsi: string;
  logo_praktikum?: string;
};

export default withAuth(HomeKoor, ['koordinator']);

function HomeKoor() {
  const token = getAccessToken();
  const [queryData, setQueryData] = React.useState<PraktikumType[]>([]);
  const [loading, setLoading] = React.useState(true);

  const LoadPraktikum = React.useCallback(async () => {
    const res = await api.get<ApiReturn<PraktikumType[]>>('/praktikum', {
      headers: {
        Authorization: token,
      },
    });
    if (!res.data.data) {
      return;
    }
    setLoading(false);
    return setQueryData(res.data.data);
  }, [token]);


  React.useEffect(() => {
    LoadPraktikum();
  }, [LoadPraktikum]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={true}
      withRightNav={true}
      withBackButton={false}
    >
      <section className='bg-darkGrey-800 relative h-full min-h-screen w-full'>
        <Background2 />

        <div className='mx-20 flex flex-col gap-20 pb-16 pt-36'>
          {loading && <Loading />}
          {!loading && queryData === undefined ? (
            <p className='flex items-center justify-center font-semibold text-orange-600'>
              Tidak ada praktikum yang tersedia
            </p>
          ) : (
            queryData.map((data, index) => (
              <div
                key={data.praktikum_id}
                className={`${
                  index % 2 === 0 ? 'flex-row-reverse text-end' : ''
                }`}
              >
                <div
                  className={`flex flex-row items-center justify-center gap-6 text-orange-600 ${
                    index % 2 === 0 ? 'flex-row-reverse text-end' : ''
                  }  z-10`}
                >
                  <div className='border-1 z-10 flex h-[260px] w-[260px] border border-white'>
                    <NextImage
                      src={data.logo_praktikum ?? '/images/home/module.png'}
                      width={308}
                      height={332}
                      alt='praktikum'
                      className=' z-10 h-full w-full object-cover'
                    />
                  </div>

                  <div
                    className={`${
                      index % 2 === 0 ? 'flex-row-reverse text-end' : ''
                    } z-10 flex w-[60%] flex-col gap-2`}
                  >
                    <h2>
                      {data.praktikum_name}
                    </h2>
                    <p>{data.deskripsi}</p>
                  </div>

                  <div className='z-10 flex  flex-col gap-4'>
                    <ButtonLink
                      href={`/home-koor/${data.praktikum_id}/kelola-modul`}
                      className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'
                    >
                      Jadwal Praktikum
                    </ButtonLink>
                    <ButtonLink
                      href={`/home-koor/${data.praktikum_id}/kelola-asisten`}
                      className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'
                    >
                      Kelola Asisten
                    </ButtonLink>
                    <ButtonLink
                      href={`/home-koor/${data.praktikum_id}/jadwal-asisten`}
                      className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'
                    >
                      Jadwal Asistensi
                    </ButtonLink>
                    <ButtonLink
                      href={`/home-koor/${data.praktikum_id}/daftar-peserta`}
                      className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'
                    >
                      Daftar Peserta
                    </ButtonLink>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
}
