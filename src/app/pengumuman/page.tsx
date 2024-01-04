'use client';

import * as React from 'react';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Card2 from '@/components/cards/card2';
import withAuth from '@/components/hoc/withAuth';
import Loading from '@/components/Loading';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';
import { PengumumanType } from '@/types/entities/pengumuman';

export default withAuth(Pengumuman, ['praktikan']);
function Pengumuman() {
  const token = getAccessToken();
  const [pengumuman, setPengumuman] = React.useState<PengumumanType[]>([]);
  const [loading, setLoading] = React.useState(true);

  const LoadPengumuman = React.useCallback(async () => {
    const res = await api.get<ApiReturn<PengumumanType[]>>('/pengumuman', {
      headers: {
        Authorization: token,
      },
    });
    if (!res.data.data) {
      return;
    }
    setLoading(false);
    return setPengumuman(res.data.data);
  }, [token]);

  React.useEffect(() => {
    LoadPengumuman();
  }, [LoadPengumuman]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={true}
      withBackButton={true}
      title='Pengumuman'
    >
      <section className='bg-darkGrey-800 relative flex min-h-screen w-full'>
        <div className='mx-20 flex w-full flex-col gap-6 pb-12 pt-28'>
          {loading && <Loading />}
          {!loading && pengumuman === undefined ? (
            <p className='flex items-center justify-center font-semibold text-orange-600'>
              Tidak ada praktikum yang tersedia
            </p>
          ) : (
            pengumuman.map((data, index) => (
              <Card2
                key={data.pengumuman_id}
                judul={data.judul}
                deskripsi={data.deskripsi}
                className={`${index % 2 === 0 ? 'text-end' : ''}`}
              />
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
}
