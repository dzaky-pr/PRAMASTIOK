'use client';

import * as React from 'react';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import Calendar from '@/components/Calendar';
import withAuth from '@/components/hoc/withAuth';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';
import { PraktikumType } from '@/types/entities/praktikum';

type JadwalYgDiambilType = {
  // praktikum_name: string;
  jadwal_id: number;
  id_modul: string;
  judul_modul: string;
  start_tgl: string;
  start_wkt: string;
  kuota: number;
};

export default withAuth(AmbilJadwalPage, ['praktikan']);
function AmbilJadwalPage({ params }: { params: { id: string } }) {
  const token = getAccessToken();
  const [queryData, setQueryData] = React.useState<JadwalYgDiambilType[]>([]);
  const [praktikum, setPraktikum] = React.useState<PraktikumType[]>([]);

  const LoadPraktikum = React.useCallback(async () => {
    const res = await api.get<ApiReturn<JadwalYgDiambilType[]>>(
      '/praktikum/jadwal-praktikum',
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (!res.data.data) {
      return;
    }
    return setQueryData(res.data.data);
  }, [token]);

  React.useEffect(() => {
    LoadPraktikum();
  }, [LoadPraktikum]);

  const LoadPraktikumName = React.useCallback(async () => {
    const res = await api.get<ApiReturn<PraktikumType[]>>('/praktikum', {
      headers: {
        Authorization: token,
      },
    });
    if (!res.data.data) {
      return;
    }

    return setPraktikum(res.data.data);
  }, [token]);

  React.useEffect(() => {
    LoadPraktikumName();
  }, [LoadPraktikumName]);

  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  function formatDate(dateString: string): string {
    const dateObject = new Date(dateString);

    const day = ('0' + dateObject.getDate()).slice(-2);
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const year = dateObject.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  const selectedPraktikum = praktikum.find(
    (p) => p.praktikum_id === Number(params.id)
  );

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title={selectedPraktikum?.praktikum_name}
    >
      <section className='bg-darkGrey-800 relative flex h-screen w-screen flex-col items-start justify-center '>
        <div className='mx-16 mb-12 mt-28 flex h-full w-screen flex-row gap-8'>
          <div className='flex h-fit w-[35%] flex-col items-start gap-6'>
            {queryData.map((data) => (
              <div
                key={data.id_modul}
                className='flex w-full flex-col items-start justify-center gap-1 text-yellow-600'
              >
                <h3 className='w-full'>{data.judul_modul}</h3>
                <Button className='w-full rounded-xl border-none bg-black py-4 font-bold text-yellow-600'>
                  {'Tanggal: ' +
                    formatDate(data.start_tgl) +
                    ', Jam: ' +
                    formatTime(data.start_wkt)}
                </Button>
              </div>
            ))}
          </div>

          <span className='bg-lightGrey-600 h-full w-2 rounded-full'></span>

          <Calendar praktikum_id={params.id} />
        </div>
      </section>
    </MainLayout>
  );
}
