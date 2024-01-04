'use client';

import NextImage from 'next/image';
import * as React from 'react';
import { FaPen } from 'react-icons/fa';
import { VscTriangleDown } from 'react-icons/vsc';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import ButtonLink from '@/components/links/ButtonLink';
import Loading from '@/components/Loading';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

type NilaiPraktikan = {
  user_id: number;
  nama: string;
  nrp: string;
  departemen: string;
  nilai_akhir: null | number;
};

export default withAuth(DaftarPesertaAsisten, ['asisten']);
function DaftarPesertaAsisten({ params }: { params: { id: string } }) {
  const [loading, setLoading] = React.useState(true);
  const [dataNilaiPraktikan, setDataNilaiPraktikan] = React.useState<
    NilaiPraktikan[]
  >([]);

  const token = getAccessToken();

  const LoadNilaiPraktikan = React.useCallback(async () => {
    const res = await api.get<ApiReturn<NilaiPraktikan[]>>(
      `/nilai/${params.id}/peserta?semester&tahun_akademik`,
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
    return setDataNilaiPraktikan(res.data.data);
  }, [params.id, token]);

  React.useEffect(() => {
    LoadNilaiPraktikan();
  }, [LoadNilaiPraktikan]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={true}
      withBackButton={true}
      title='Daftar Peserta'
    >
      <section className='bg-darkGrey-800 relative flex h-screen w-screen'>
        <div className='mx-16 h-full w-screen pt-28'>
          <div className='flex flex-row items-center justify-between'>
            <div className='bg-darkGrey-800 flex  h-fit w-auto flex-row items-center justify-between rounded-full border border-orange-600 px-4  text-orange-600 placeholder:text-orange-600 placeholder:opacity-60'>
              <NextImage
                src='/images/mix/search.png'
                width={30}
                height={30}
                alt='search'
                className='h-auto w-auto'
              />

              <input
                type='text'
                name='search'
                id='search'
                className='border-none bg-transparent font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-0 '
                placeholder='Search'
              />
            </div>

            <div className='flex flex-row gap-10'>
              <div className='flex flex-col font-bold text-orange-600'>
                <h4>Semester</h4>
                <Button
                  rightIcon={VscTriangleDown}
                  variant='outline'
                  className='flex flex-row justify-between gap-4 rounded-full border border-orange-600 font-bold  text-orange-600'
                >
                  Semua
                </Button>
              </div>

              <div className='flex flex-col font-bold text-orange-600'>
                <h4>Tahun Akdemik</h4>
                <Button
                  rightIcon={VscTriangleDown}
                  variant='outline'
                  className='flex flex-row justify-between gap-4 rounded-full border-orange-600 font-bold  text-orange-600'
                >
                  Semua
                </Button>
              </div>
            </div>
          </div>

          <table className='mb-10 mt-8 w-full table-auto text-orange-600'>
            <thead>
              <tr>
                <th className='text-center'>No</th>
                <th className='text-center'>Nama</th>
                <th className='text-center'>NRP</th>
                <th className='text-center'>Departemen</th>
                <th className='text-center'>Nilai</th>
              </tr>
            </thead>

            <tbody className=''>
              {loading && <Loading />}

              {!loading &&
                dataNilaiPraktikan.map((e, index) => (
                  <tr key={e.user_id} className=''>
                    <td className=' p-2 text-center'>{index + 1}</td>
                    <td className=' p-2 text-center'>{e.nama}</td>
                    <td className=' p-2 text-center'>{e.nrp}</td>
                    <td className=' p-2 text-center'>{e.departemen}</td>
                    {e.nilai_akhir !== null ? (
                      <td className=' flex flex-row items-center justify-center gap-2 p-2'>
                        {e.nilai_akhir}{' '}
                        <ButtonLink
                          leftIcon={FaPen}
                          href={`/home-asisten/${params.id}/daftar-peserta/${e.user_id}/nilai-praktikan`}
                          variant='outline'
                          className='rounded-full border-orange-600 px-6 py-2 text-orange-600'
                        >
                          {' '}
                        </ButtonLink>
                      </td>
                    ) : (
                      <td className=' flex flex-row items-center justify-center gap-2 p-2'>
                        Belum ada nilai akhir
                        <ButtonLink
                          leftIcon={FaPen}
                          href={`/home-asisten/${params.id}/daftar-peserta/${e.user_id}/nilai-praktikan`}
                          variant='outline'
                          className='rounded-full border-orange-600 px-6 py-2 text-orange-600'
                        >
                          {' '}
                        </ButtonLink>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

          {!loading && dataNilaiPraktikan.length === 0 && (
            <p className='mt-12 flex w-full items-center justify-center font-semibold text-orange-600'>
              Tidak ada praktikan yang terdaftar
            </p>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
