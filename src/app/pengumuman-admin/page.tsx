'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import IconButton from '@/components/buttons/IconButton';
import withAuth from '@/components/hoc/withAuth';
import Loading from '@/components/Loading';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';
import { PengumumanType } from '@/types/entities/pengumuman';

export default withAuth(PengumumanAdmin, ['admin']);
function PengumumanAdmin() {
  const router = useRouter();
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

  const handleDeleteButtonClick = async (pengumuman_id: number | undefined) => {
    try {
      await api.delete<ApiReturn<PengumumanType[]>>(
        `/pengumuman/${pengumuman_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      LoadPengumuman();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

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
        <div className='relative mx-20 flex w-full flex-col gap-6 pb-12 pt-28'>
          {loading && <Loading />}
          {!loading && pengumuman === undefined ? (
            <p className='flex items-center justify-center font-semibold text-orange-600'>
              Tidak ada praktikum yang tersedia
            </p>
          ) : (
            pengumuman.map((data, index) => (
              <div
                className={`${index % 2 === 1 ? 'justify-end text-end' : ''}`}
                key={data.pengumuman_id}
              >
                <div
                  className={`border-1 z-10 flex flex-col gap-1 rounded-3xl border border-orange-600 p-4 text-orange-600 ${
                    index % 2 === 1 ? 'justify-end text-end' : ''
                  } w-full`}
                >
                  <h2
                    className={`${
                      index % 2 === 1 ? 'justify-end text-end' : ''
                    } flex w-full flex-row gap-2`}
                  >
                    {data.judul}
                    <div className='flex flex-row gap-0.5'>
                      <IconButton
                        icon={FaTrashAlt}
                        onClick={() =>
                          handleDeleteButtonClick(data.pengumuman_id)
                        }
                        variant='ghost'
                        className='h-[12px] w-[12px] text-white hover:text-orange-600'
                      />
                      <Link
                        href={`/pengumuman-admin/${data.pengumuman_id}/edit`}
                      >
                        <IconButton
                          icon={FaPen}
                          variant='ghost'
                          className='h-[12px] w-[12px] text-white hover:text-orange-600'
                        />
                      </Link>
                    </div>
                  </h2>
                  <p>{data.deskripsi}</p>
                </div>
              </div>
            ))
          )}
          <IconButton
            onClick={() => {
              router.push('/pengumuman-admin/buat-pengumuman');
            }}
            icon={FaPlus}
            className='fixed bottom-12 right-12 h-[40px] w-[80px] rounded-full border-orange-600 bg-black text-orange-600'
            variant='outline'
          />
        </div>
      </section>
    </MainLayout>
  );
}
