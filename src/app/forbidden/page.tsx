'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBackOutline } from 'react-icons/io5';

import Button from '@/components/buttons/Button';

import useAuthStore from '@/stores/useAuthStore';

export default function Forbidden() {
  const router = useRouter();
  const user = useAuthStore.useUser();

  const handleBack = () => {
    if (user?.roles[0] === 'praktikkan' && user?.roles[1] !== 'asisten') {
      router.push('/home');
    } else if (
      user?.roles[0] === 'praktikkan' &&
      user?.roles[1] === 'asisten'
    ) {
      router.push('/home-asisten');
    } else if (user?.roles[0] === 'admin') {
      router.push('/home-admin');
    }
  };
  return (
    <>
      <main className='bg-darkGrey-800 flex min-h-screen flex-col items-center justify-center gap-5'>
        <h1 className='text-7xl font-bold uppercase text-orange-600'>
          Forbidden
        </h1>
        <p className='text-lg font-medium text-orange-600'>
          You dont have the right permission to access this page
        </p>
        <Button
          onClick={handleBack}
          className='bg-darkGrey-600 rounded-3xl p-2 '
        >
          <IoArrowBackOutline size={40} className='text-orange-600' />
        </Button>
      </main>
    </>
  );
}
