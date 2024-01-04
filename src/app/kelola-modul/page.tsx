'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPlus, FaRegClock, FaTrashAlt } from 'react-icons/fa';

import IconButton from '@/components/buttons/IconButton';
import withAuth from '@/components/hoc/withAuth';

import MainLayout from '@/layouts/MainLayout';

export default withAuth(KelolaModul, ['admin']);

function KelolaModul() {
  const router = useRouter();
  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Modul Praktikum'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          {/* <FormProvider {...methods}> */}
          <div
            // onSubmit={handleSubmit(onSubmit)}
            className='bg-darkGrey-800 container mx-auto mt-8 flex w-screen flex-col gap-6 rounded-3xl border-none'
          >
            <div className=' flex w-full flex-col gap-4'>
              <div className='flex w-full flex-row justify-between rounded-full border border-orange-600 bg-transparent px-4 py-2  font-bold'>
                <h3>P1: Logika Dasar</h3>
                <div className='flex flex-row gap-1'>
                  <IconButton
                    variant='ghost'
                    className='text-orange-600'
                    icon={FaRegClock}
                  />

                  <IconButton
                    variant='ghost'
                    className='text-orange-600'
                    icon={FaTrashAlt}
                  />
                </div>
              </div>

              <div className='flex w-full flex-row justify-between rounded-full border border-orange-600 bg-transparent px-4 py-2  font-bold'>
                <h3>P2: Rangkaian FLip Flop</h3>
                <div className='flex flex-row gap-0.5'>
                  <IconButton
                    variant='ghost'
                    className='text-orange-600'
                    icon={FaRegClock}
                  />
                  <IconButton
                    variant='ghost'
                    className='text-orange-600'
                    icon={FaTrashAlt}
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-end'>
              <IconButton
                onClick={() => {
                  router.push('/kelola-modul/edit-modul');
                }}
                variant='dark'
                className='h-[40px] w-[100px] rounded-full border-none text-orange-600'
                icon={FaPlus}
              />
            </div>
          </div>
          {/* </FormProvider> */}
        </div>
      </section>
    </MainLayout>
  );
}
