'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import withAuth from '@/components/hoc/withAuth';

import MainLayout from '@/layouts/MainLayout';

import { ApiError, ApiReturn } from '@/types/api';

type JadwalPraktikumType = {
  jadwal_id?: number;
  praktikum_id?: number;
  praktikum_name?: string;
  judul_modul: string;
  start_tgl: string;
  start_wkt: string;
  asisten_user_id: number;
  nama_asisten: string;
  kelompok_id?: number;
  nama_kelompok: string;
  id_kelompok: number | null;
};

export default withAuth(JadwalPage, ['praktikan']);

function JadwalPage() {
  const token = getAccessToken();
  const router = useRouter();
  const [jadwalPraktikum, setJadwalPraktikum] = React.useState<
    JadwalPraktikumType[]
  >([]);

  const LoadJadwalPraktikum = React.useCallback(async () => {
    try {
      const res = await api.get<ApiReturn<JadwalPraktikumType[]> & ApiError>(
        '/praktikum/jadwal-praktikum',
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return setJadwalPraktikum(res.data.data);
    } catch (err) {
      router.push('/forbidden');
    }
  }, [token, router]);

  React.useEffect(() => {
    LoadJadwalPraktikum();
  }, [LoadJadwalPraktikum]);

  function formatDate(inputDate: string) {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  }

  function formatTime(inputTime: string) {
    const timeComponents = inputTime.split(':');

    const hour = String(timeComponents[0]).padStart(2, '0');
    const minute = String(timeComponents[1]).padStart(2, '0');

    return `${hour}:${minute}`;
  }

  function ambilAngkaDariNamaKelompok(namaKelompok: string): number | null {
    const regex = /\d+/g;
    const hasilCocok = namaKelompok.match(regex);

    if (hasilCocok) {
      return parseInt(hasilCocok[0], 10);
    } else {
      return null;
    }
  }

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Jadwal Praktikum Anda'
    >
      <section className='bg-darkGrey-800 relative flex h-screen w-screen'>
        <div className='mx-16 w-screen pt-28'>
          <table className='mb-10 mt-6 w-full table-auto text-orange-600'>
            {jadwalPraktikum.length === 0 && (
              <p className='flex items-center justify-center font-semibold text-orange-600'>
                Tidak ada jadwal praktikum yang tersedia
              </p>
            )}
            {jadwalPraktikum.length !== 0 &&
              jadwalPraktikum.map((data, index) => (
                <tbody key={index}>
                  <tr className='border'>
                    <td className='border text-center' rowSpan={6000}>
                      <h2>{data.praktikum_name}</h2>
                    </td>
                  </tr>

                  <CardJadwal
                    judul_modul={data.judul_modul}
                    start_tgl={formatDate(data.start_tgl)}
                    start_wkt={formatTime(data.start_wkt)}
                    nama_asisten={data.nama_asisten}
                    nama_kelompok={data.nama_kelompok}
                    id_kelompok={ambilAngkaDariNamaKelompok(data.nama_kelompok)}
                    asisten_user_id={data.asisten_user_id}
                    jadwal_id={data.jadwal_id}
                  />
                </tbody>
              ))}
          </table>
        </div>
      </section>
    </MainLayout>
  );
}

function CardJadwal({
  judul_modul,
  start_tgl,
  start_wkt,
  nama_asisten,
  nama_kelompok,
  asisten_user_id,
  jadwal_id,
}: JadwalPraktikumType) {
  return (
    <>
      <tr className='border'>
        <td className='border p-6 font-bold'>{judul_modul}</td>
        <td className='border p-6 font-bold'>{start_wkt}</td>
        <td className='border p-6 font-bold'>{start_tgl}</td>
        <td className='border p-6 font-bold'>
          <Link href={`/profile-asisten/${asisten_user_id}`}>
            {nama_asisten}
          </Link>
        </td>
        <td className='border p-6 font-bold'>
          <Link href={`/daftar-kelompok/${jadwal_id}`}>{nama_kelompok}</Link>
        </td>
      </tr>
    </>
  );
}
