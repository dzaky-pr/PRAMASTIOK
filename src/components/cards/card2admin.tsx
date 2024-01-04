'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPen, FaTrashAlt } from 'react-icons/fa';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import IconButton from '@/components/buttons/IconButton';
import { showToast, SUCCESS_TOAST, WARNING_TOAST } from '@/components/Toast';

import { ApiReturn } from '@/types/api';
import { PengumumanType } from '@/types/entities/pengumuman';

export default function Card2Admin({
  judul,
  deskripsi,
  className,
}: PengumumanType) {
  const router = useRouter();
  const token = getAccessToken();
  const [pengumuman, setPengumuman] = React.useState<PengumumanType[]>([]);

  const LoadPengumuman = React.useCallback(async () => {
    const res = await api.get<ApiReturn<PengumumanType[]>>(`/pengumuman`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.data.data) {
      return;
    }
    return setPengumuman(res.data.data);
  }, [token]);

  React.useEffect(() => {
    LoadPengumuman();
  }, [LoadPengumuman]);

  const handleDeleteButtonClick = async () => {
    try {
      const res = await api.delete<ApiReturn<PengumumanType[]>>(
        `/pengumuman/${pengumuman}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Check if the deletion was successful
      if (res.data.data) {
        // Reload the list of pengumumans
        showToast('Berhasil menghapus pengumuman!', SUCCESS_TOAST);
        LoadPengumuman();
      } else {
        showToast('Gagal menghapus pengumuman!', WARNING_TOAST);
        // Handle error (display an alert, show an error message, etc.)
        // console.error('Error deleting pengumuman:', res.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      // console.error('Error deleting pengumuman:', error);
    }
  };

  return (
    <div
      className={`border-1 z-10 flex flex-col gap-1 rounded-3xl border border-orange-600 p-4 text-orange-600 ${className} w-full`}
    >
      <h2 className={`${className} flex w-full flex-row gap-2`}>
        {judul}
        <div className='flex flex-row gap-0.5'>
          <IconButton
            icon={FaTrashAlt}
            onClick={handleDeleteButtonClick}
            variant='ghost'
            className='h-[12px] w-[12px] text-white hover:text-orange-600'
          />
          <IconButton
            icon={FaPen}
            onClick={() => router.push('/pengumuman-admin/edit-pengumuman')}
            variant='ghost'
            className='h-[12px] w-[12px] text-white hover:text-orange-600'
          />
        </div>
      </h2>
      <p>{deskripsi}</p>
    </div>
  );
}
