'use client';

import { useState } from 'react';
import React from 'react';
import ReactCalendar from 'react-calendar';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';

import { ApiReturn } from '@/types/api';

type JadwalType = {
  jadwal_id: number;
  id_modul: string;
  judul_modul: string;
  start_tgl: string | Date;
  start_wkt: string | Date;
  kuota: number;
};

interface DateType {
  justDate: Date | null;
  dateTime: Date | null;
}

export default function Calendar({ praktikum_id }: { praktikum_id: string }) {
  const [date, setDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  });

  // eslint-disable-next-line no-console
  // console.log(praktikum_id);

  const [waktuRILL, setWaktuRILL] = useState<JadwalType[]>([]);

  const [dataStart_wkt, setDataStart_wkt] = useState<string>();
  const [dataStart_tgl, setDataStart_tgl] = useState<string>();
  const [dataJadwal_id, setDataJadwal_id] = useState<number>();

  // eslint-disable-next-line no-console
  // console.log(formatYear(date.dateTime));
  // eslint-disable-next-line no-console
  // console.log(formatTime(date.dateTime));

  const handleDateClick = (date: Date) => {
    // eslint-disable-next-line no-console
    // console.log(formatYear(date));
    setDataStart_tgl(formatYear(date));
    setDate((prev) => ({ ...prev, justDate: date }));

    // Data berdasarakan date yg di click
    const clickedData = filterDataByDateTime(queryData, formatYear(date));

    // eslint-disable-next-line no-console
    // console.log(clickedData);

    const time = getTimes(clickedData);

    return { time };
  };

  const getTimes = (data: JadwalType[]) => {
    if (!date.justDate) return;

    const times = [];

    for (let i = 0; i < data.length; i++) {
      times.push(data[i]);
    }
    // eslint-disable-next-line no-console
    // console.log(times);
    setWaktuRILL(times);

    return times;
  };

  function formatYear(inputDate: string | null | Date): string {
    if (!inputDate) {
      return `Tanggal tidak valid: ` + inputDate;
    }

    const dateObject = new Date(inputDate);

    const year = dateObject.getFullYear();
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObject.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  // function formatTime(inputDate: string | null | Date): string {
  //   if (!inputDate) {
  //     return `Tanggal tidak valid: ` + inputDate;
  //   }

  //   const dateObject = new Date(inputDate);

  //   const hours = ('0' + dateObject.getHours()).slice(-2);
  //   const minutes = ('0' + dateObject.getMinutes()).slice(-2);
  //   const seconds = ('0' + dateObject.getSeconds()).slice(-2);

  //   const formattedTime = `${hours}:${minutes}:${seconds}`;

  //   return formattedTime;
  // }

  const token = getAccessToken();
  const [queryData, setQueryData] = React.useState<JadwalType[]>([]);

  const LoadPraktikum = React.useCallback(async () => {
    const res = await api.get<ApiReturn<JadwalType[]>>(
      `/praktikum/${praktikum_id}/ambil`,
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
  }, [praktikum_id, token]);

  React.useEffect(() => {
    LoadPraktikum();
  }, [LoadPraktikum]);

  // eslint-disable-next-line no-console
  // console.log(queryData);

  function filterDataByDateTime(
    data: JadwalType[],
    targetDate: string | Date
  ): JadwalType[] {
    return data.filter((item) => {
      const itemDate = item.start_tgl.toString().split('T')[0];
      return itemDate === targetDate;
    });
  }

  const DATAPOST = {
    start_tgl: dataStart_tgl,
    start_wkt: dataStart_wkt,
    jadwal_id: dataJadwal_id,
  };

  async function PostData() {
    try {
      const res = await api.post(`/praktikum/${praktikum_id}/ambil`, DATAPOST, {
        toastify: true,
      });
      LoadPraktikum();
      return res;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((error as any).response.data.message);
    }
  }

  return (
    <div className='bg-darkGrey-800  flex h-full w-full flex-col justify-start text-orange-600'>
      <div className='flex w-[80%] flex-col items-start justify-center gap-6'>
        <ReactCalendar
          minDate={new Date()}
          className='REACT-CALENDAR p-2'
          view='month'
          onClickDay={handleDateClick}
        />

        <div className='flex w-full flex-col justify-center gap-4'>
          <h3>Waktu</h3>
          <span className='bg-lightGrey-600 h-1.5 w-20 rounded-full'></span>

          <div className='flex flex-col  items-end gap-4'>
            <div className='flex w-full flex-row justify-start gap-4'>
              {waktuRILL?.map((time, i) => (
                <button
                  key={`time-${i}`}
                  className='rounded-xl bg-black px-8 py-2 font-bold hover:bg-slate-600 focus:bg-slate-600'
                  type='button'
                  onClick={() => {
                    setDataStart_wkt(String(time.start_wkt));
                    setDataJadwal_id(Number(time.jadwal_id));
                  }}
                >
                  {String(time.start_wkt)}
                </button>
              ))}
            </div>

            <Button
              type='submit'
              className=' w-fit items-center rounded-xl border-none bg-black px-8 py-2 text-center font-bold text-yellow-600'
              onClick={() => PostData()}
            >
              Ambil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
