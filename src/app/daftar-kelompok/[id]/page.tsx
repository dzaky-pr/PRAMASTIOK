'use client';

import * as React from 'react';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import withAuth from '@/components/hoc/withAuth';

import MainLayout from '@/layouts/MainLayout';

type DaftarKelompok = {
  kelompok_id: number;
  nama: string;
  nrp: string;
  nama_kelompok: string;
};

interface Data {
  kelompok: DaftarKelompok[];
}

export default withAuth(DaftarKelompok, ['authed']);
function DaftarKelompok({ params }: { params: { id: string } }) {
  const token = getAccessToken();
  const [dataDaftarKelompok, setDataDaftarKelompok] =
    React.useState<DaftarKelompok[]>();

  const LoadPraktikum = React.useCallback(async () => {
    const res = await api.get<Data>(
      `/praktikum/jadwal-praktikum/${params.id}/kelompok`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (!res) {
      return;
    }
    return setDataDaftarKelompok(res.data.kelompok);
  }, [params.id, token]);

  React.useEffect(() => {
    LoadPraktikum();
  }, [LoadPraktikum]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Daftar Kelompok'
    >
      <section className='bg-darkGrey-800 relative flex h-full min-h-screen w-screen'>
        <div className='mx-16 w-screen pt-28'>
          <table className='mb-10 mt-6 w-full table-auto text-orange-600'>
            <tbody>
              {dataDaftarKelompok?.map((data) => (
                <tr key={data.kelompok_id} className='border'>
                  <td className='border pl-4' rowSpan={7}>
                    <h4>{data.nama_kelompok}</h4>
                  </td>
                  <td className='border pl-4'>{data.nrp}</td>
                  <td className='border pl-4'>{data.nama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </MainLayout>
  );
}
