'use client';

import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPen, FaTrashAlt } from 'react-icons/fa';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import ButtonLink from '@/components/links/ButtonLink';

import { PraktikumType } from '@/app/home/page';

import { ApiReturn } from '@/types/api';

export default function Card1Admin({
  praktikum_name,
  deskripsi,
  logo_praktikum,
  className,
}: PraktikumType) {
  const router = useRouter();
  const token = getAccessToken();
  const [queryData, setQueryData] = React.useState<PraktikumType[]>([]);

  const LoadPraktikum = React.useCallback(async () => {
    const res = await api.get<ApiReturn<PraktikumType[]>>('/praktikum', {
      headers: {
        Authorization: token,
      },
    });
    if (!res.data.data) {
      return;
    }
    return setQueryData(res.data.data);
  }, [token]);

  React.useEffect(() => {
    LoadPraktikum();
  }, [LoadPraktikum]);

  const handleDeleteButtonClick = async () => {
    try {
      await api.delete<ApiReturn<PraktikumType[]>>(`praktikum/${queryData}`, {
        headers: {
          Authorization: token,
        },
      });

      LoadPraktikum();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <div
      className={`flex flex-row items-center justify-center gap-6 text-orange-600 ${className}  z-10`}
    >
      <div className='border-1 z-10 flex h-[260px] w-[260px] border border-white'>
        <NextImage
          src={`${logo_praktikum}`}
          width={308}
          height={332}
          alt='praktikum'
          className=' z-10 h-full w-full object-cover'
        />
      </div>

      <div className={`${className} z-10 flex w-[60%] flex-col gap-2`}>
        <h2>
          {praktikum_name}
          <IconButton
            icon={FaTrashAlt}
            onClick={handleDeleteButtonClick}
            variant='ghost'
            className='h-[16px] w-[16px] text-white hover:text-orange-600'
          />
          <IconButton
            icon={FaPen}
            onClick={() => router.push('/home-admin/edit-praktikum')}
            variant='ghost'
            className='h-[16px] w-[16px] text-white hover:text-orange-600'
          />
        </h2>
        <p>{deskripsi}</p>
      </div>

      <div className='z-10 flex  flex-col gap-4'>
        <Button className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'>
          Kelola Modul
        </Button>
        <Button className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'>
          Kelola Asisten
        </Button>
        <ButtonLink
          href='/jadwal'
          className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'
        >
          Jadwal Asistensi
        </ButtonLink>
        <ButtonLink
          href='/daftar-peserta'
          className='w-full justify-center rounded-full bg-white px-6 py-4 font-bold text-black'
        >
          Daftar Peserta
        </ButtonLink>
      </div>
    </div>
  );
}
