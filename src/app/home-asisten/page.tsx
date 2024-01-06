'use client';

import * as React from 'react';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Background2 from '@/components/backgrounds/background2';
import Card1Asisten from '@/components/cards/card1asisten';
import withAuth from '@/components/hoc/withAuth';
import Loading from '@/components/Loading';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

export type PraktikumType = {
  praktikum_name: string;
  deskripsi: string;
  logo_praktikum?: string;
  praktikum_id?: number;
  className?: string; 
};

export default withAuth(HomeAsisten, ['asisten']);

function HomeAsisten() {
  const token = getAccessToken();
  const [queryData, setQueryData] = React.useState<PraktikumType[]>([]);
  const [loading, setLoading] = React.useState(true);

  const LoadPraktikum = React.useCallback(async () => {
    const res = await api.get<ApiReturn<PraktikumType[]>>('/praktikum', {
      headers: {
        Authorization: token,
      },
      params: {
        role: 'asisten',
        // Add other query parameters as needed
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

        <div className='mx-20 flex flex-col gap-8 pb-16 pt-36'>
          {loading && <Loading />}
          {!loading && queryData === undefined ? (
            <p className='flex items-center justify-center font-semibold text-orange-600'>
              Tidak ada praktikum yang tersedia
            </p>
          ) : (
            queryData.map((data, index) => (
              <Card1Asisten
                key={data.praktikum_id}
                praktikum_name={data.praktikum_name}
                deskripsi={data.deskripsi}
                logo_praktikum='/images/home/module.png'
                className={`${
                  index % 2 === 0 ? 'flex-row-reverse text-end' : ''
                }`}
                id={data.praktikum_id}
              />
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
}
