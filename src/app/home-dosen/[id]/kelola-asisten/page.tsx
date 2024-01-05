'use client';

import * as React from 'react';
import { FaPlus } from 'react-icons/fa';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import ButtonLink from '@/components/links/ButtonLink';
import Loading from '@/components/Loading';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

type User = {
  role_id: number;
  nama: string;
  nrp: string;
  role_name: string;
};

export default withAuth(KelolaAsisten, ['dosen']);

function KelolaAsisten({ params }: { params: { id: string } }) {
  const [loading, setLoading] = React.useState(true);

  const token = getAccessToken();

  const [dataAsisten, setDataAsisten] = React.useState<User[]>([]);
  const LoadAsisten = React.useCallback(async () => {
    const res = await api.get<ApiReturn<User[]>>(`/role/${params.id}`, {
      headers: {
        Authorization: token,
      },
    });
    if (!res.data.data) {
      return;
    }
    setLoading(false);
    return setDataAsisten(res.data.data);
  }, [params.id, token]);

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
    return setDataAsisten(res.data.data);
  }, [params.id, token]);



  const handleDeleteButtonClick = async (nrp: string | undefined) => {
    try {
      await api.delete<ApiReturn<User[]>>(`/role/${params.id}/asisten/${nrp}`, {
        headers: {
          Authorization: token,
        },
      });

      LoadAsisten();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleDeleteButtonClick1 = async (nrp: string | undefined) => {
    try {
      await api.delete<ApiReturn<User[]>>(`/role/${params.id}/koor/${nrp}`, {
        headers: {
          Authorization: token,
        },
      });
      LoadKoor();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };


  React.useEffect(() => {
    LoadAsisten();
  }, [LoadAsisten]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Kelola Asisten'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          <div className=' align-left container mx-auto flex h-full w-screen flex-row items-start gap-2 '>
            <ButtonLink
              rightIcon={FaPlus}
              href={`/home-dosen/${params.id}/kelola-asisten/tambah-asisten`}
              // href='/'
              className=' flex flex-row gap-1.5 rounded-3xl border-none bg-black text-orange-600'
            >
              Tambah Asisten
            </ButtonLink>
            <ButtonLink
              rightIcon={FaPlus}
              href={`/home-dosen/${params.id}/kelola-asisten/tambah-koordinator`}
              // href='/'
              className=' flex flex-row gap-1.5 rounded-3xl border-none bg-black text-orange-600'
            >
              Tambah Koordinator
            </ButtonLink>

          </div>
          <div className=' container mx-auto flex h-full w-screen flex-col items-start justify-center gap-2 '>
            <table className='w-full table-fixed '>
              <thead>
                <tr className='border'>
                  <th className='border p-2'>Nama</th>
                  <th className='border p-2'>NRP</th>
                  <th className='border p-2'>Peran</th>
                  <th className='border p-2'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}

                {!loading && dataAsisten === undefined ? (
                  <p className='flex items-center justify-center font-semibold text-orange-600'>
                    Tidak ada asisten yang tersedia
                  </p>
                ) : (
                  dataAsisten.map((e) => (
                    <tr key={e.role_id} className='border'>
                      <td className='border p-2 text-center'>{e.nama}</td>
                      <td className='border p-2 text-center'>{e.nrp}</td>
                      <td className='border p-2 text-center'>{e.role_name}</td>
                     {e.role_name !== 'dosen' && (
                      <td className='flex w-full justify-center p-2 '>
                        <Button
                          className='bg-darkGrey-900 rounded-3xl border border-none text-orange-600'
                          onClick={() => {
                            if (e.role_name === 'koordinator') {
                              handleDeleteButtonClick1(e.nrp);
                            } else if (e.role_name === 'asisten') {
                              handleDeleteButtonClick(e.nrp);
                            }
                          }}
                        >
                          Copot Peran
                        </Button>
                      </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
