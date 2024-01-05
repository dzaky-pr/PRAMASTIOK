'use client';

import Link from 'next/link';
import * as React from 'react';
import { FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import IconButton from '@/components/buttons/IconButton';
import withAuth from '@/components/hoc/withAuth';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

export type DaftarJadwalPraktikumType = {
  jadwal_id: number;
  id_modul: string;
  praktikum_id: number;
  judul_modul: string;
  start_tgl: Date;
  sesi: string;
};

export default withAuth(DaftarJadwalPraktikum, ['dosen']);

function DaftarJadwalPraktikum({ params }: { params: { id: string } }) {
  const token = getAccessToken();
  const [dataJadwal, setDataJadwal] =
    React.useState<DaftarJadwalPraktikumType[]>();

  const LoadDaftarJadwal = React.useCallback(async () => {
    const res = await api.get<ApiReturn<DaftarJadwalPraktikumType[]>>(
      `/praktikum/${params.id}/modul/jadwal`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (!res.data.data) {
      return;
    }
    return setDataJadwal(res.data.data);
  }, [params.id, token]);

  React.useEffect(() => {
    LoadDaftarJadwal();
  }, [LoadDaftarJadwal]);

  function formatDate(dateString: string): string {
    const dateObject = new Date(dateString);

    const day = ('0' + dateObject.getDate()).slice(-2);
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
  }

  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  const handleDeleteButtonClick = async (jadwal_id: number | undefined) => {
    try {
      await api.delete(`/praktikum/${params.id}/modul/jadwal/${jadwal_id}`, {
        headers: {
          Authorization: token,
        },
      });
      LoadDaftarJadwal();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((error as any).response.data.message);
    }
  };

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Jadwal Praktikum'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          <div className='bg-darkGrey-800 container mx-auto flex w-screen flex-col gap-4 '>
            {dataJadwal?.map((jadwal) => (
              <div
                key={jadwal.id_modul}
                className='flex flex-col gap-4 rounded-3xl border border-orange-600 p-6'
              >
                <div className=' flex w-full flex-col gap-1'>
                  <div className='flex flex-row justify-between'>
                    <h3>{jadwal.judul_modul}</h3>
                    <IconButton
                      onClick={() => handleDeleteButtonClick(jadwal.jadwal_id)}
                      icon={FaTrashAlt}
                      type='submit'
                      className='flex h-6 w-6 rounded-xl border-none  text-orange-600'
                      variant='ghost'
                    />
                  </div>
                  <p>Tanggal: {formatDate(jadwal.start_tgl.toString())} </p>
                </div>

                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col gap-1.5'>
                    <h3>Sesi</h3>

                    <div className='flex flex-row justify-between'>
                      <div className='flex w-fit flex-row gap-3'>
                        <button
                          className='w-auto rounded-xl bg-black px-8 py-2 font-bold hover:bg-slate-600 focus:bg-slate-600'
                          type='button'
                        >
                          {formatTime(jadwal.sesi)}
                        </button>
                      </div>
                      <Link
                        href={`/home-dosen/${params.id}/daftar-jadwal-praktikum/${jadwal.jadwal_id}/edit`}
                      >
                        <IconButton
                          icon={FaPen}
                          type='submit'
                          className='flex h-6 w-6 rounded-xl border-none  text-orange-600'
                          variant='ghost'
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className='flex justify-end'>
              <Link href={`/home-dosen/${params.id}/buat-jadwal-praktikum`}>
                <IconButton
                  type='submit'
                  icon={FaPlus}
                  className='w-24 rounded-xl  border-none bg-black text-orange-600'
                >
                  Simpan
                </IconButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
