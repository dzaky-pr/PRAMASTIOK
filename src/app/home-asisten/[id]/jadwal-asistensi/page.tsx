'use client';

import { ApiError } from 'next/dist/server/api-utils';
import React from 'react';
import { FaPen } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import withAuth from '@/components/hoc/withAuth';
import Loading from '@/components/Loading';

import useAuthStore from '@/stores/useAuthStore';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

type JadwalAsistensiAdminType = {
  praktikum_id: number;
  jadwal_id: number;
  praktikum_name: string;
  judul_modul: string;
  start_tgl: string;
  sesi: string;
  nama_asisten: string | null;
  kelompok_id: number | null;
  nama_kelompok: string | null;
};

export default withAuth(JadwalAsistensi, ['asisten']);

function JadwalAsistensi({ params }: { params: { id: string } }) {
  const [loading, setLoading] = React.useState(true);
  const token = getAccessToken();

  const user = useAuthStore.useUser();

  const [jadwalAsitensi, setJadwalAsistensi] = React.useState<
    JadwalAsistensiAdminType[]
  >([]);
  const LoadJadwalPraktikum = React.useCallback(async () => {
    try {
      const res = await api.get<
        ApiReturn<JadwalAsistensiAdminType[]> & ApiError
      >(`/asistensi/${params.id}/asistensi`, {
        headers: {
          Authorization: token,
        },
      });
      if (!res.data.data) {
        return;
      }
      setLoading(false);
      return setJadwalAsistensi(res.data.data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, [params.id, token]);

  const handleDelete = async (jadwal_id: number | undefined) => {
    try {
      await api.delete(
        `/asistensi/${params.id}/asistensi/${jadwal_id}/${user?.user_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      LoadJadwalPraktikum();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleAmbil = async (jadwal_id: number | undefined) => {
    try {
      const requestBody = new URLSearchParams();
      requestBody.append('jadwalId', String(jadwal_id));

      await api.post(
        `/asistensi/${params.id}/asistensi`,
        requestBody.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token,
          },
        }
      );

      // Assuming LoadJadwalPraktikum is a function to reload the data
      LoadJadwalPraktikum();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  function formatDate(inputDate: string): string {
    const dateObject = new Date(inputDate);

    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
  }

  React.useEffect(() => {
    LoadJadwalPraktikum();
  }, [LoadJadwalPraktikum]);

  const selectedJadwalAsitensi = jadwalAsitensi.find(
    (p) => p.praktikum_id === Number(params.id)
  );

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title={`Jadwal Asistensi ` + selectedJadwalAsitensi?.praktikum_name}
    >
      <section className='bg-darkGrey-800 relative flex h-full min-h-screen w-screen'>
        <div className='mx-16 w-screen pt-28'>
          <table className='mb-10 mt-6 w-full table-auto text-orange-600'>

           <tbody className=''>
            {loading && <Loading />}


            {!loading && jadwalAsitensi?.map((jadwal) => (
              <tbody key={jadwal.jadwal_id} className='border'>
                <tr className=''>
                  <td className='border text-center' rowSpan={6000}>
                    <h2>{jadwal.praktikum_name}</h2>
                  </td>

                  <td className='border text-center' rowSpan={6000}>
                    <h4>{jadwal.judul_modul}</h4>
                  </td>

                  <td className='border text-center' rowSpan={6000}>
                    <h4>{jadwal.sesi}</h4>
                  </td>

                  <td className='border text-center' rowSpan={6000}>
                    <h4>{formatDate(jadwal.start_tgl)}</h4>
                  </td>

                  <td className=' border px-4 py-8 text-center'>
                    {jadwal.nama_asisten === null ? (
                      <IconButton
                        onClick={() => handleAmbil(jadwal.jadwal_id)}
                        icon={FaPen}
                        className='w-[80px] rounded-lg border-orange-600 bg-transparent text-orange-600'
                      />
                    ) : (
                      <div className='flex flex-col items-center justify-center text-center'>
                        <h4 className='text-center'>
                          {jadwal.nama_asisten} (Anda)
                        </h4>
                        <Button
                          onClick={() => handleDelete(jadwal.jadwal_id)}
                          rightIcon={IoCloseSharp}
                          className='text-darkGrey-900 bg-lightGrey-500 w-fit  rounded-full border-black'
                        >
                          Batalkan
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className='border text-center font-bold'>
                    {jadwal.nama_kelompok}
                  </td>
                </tr>
              </tbody>
            ))}
            </tbody>
          </table>
          {!loading && jadwalAsitensi.length === 0 && (
            <p className='mt-12 flex w-full items-center justify-center font-semibold text-orange-600'>
              Tidak ada Jadwal Praktikum yang terdaftar
            </p>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
