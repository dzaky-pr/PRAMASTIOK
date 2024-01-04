'use client';

import React from 'react';
import { FaPlus } from 'react-icons/fa';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import withAuth from '@/components/hoc/withAuth';

import MainLayout from '@/layouts/MainLayout';

export default withAuth(TambahModul, ['admin']);

function TambahModul() {
  const [newModuls, setNewModuls] = React.useState(['']); // Initialize as an array

  const handleAddSection = () => {
    // Cek apakah input terakhir sudah diisi sebelum menambahkan input baru
    const lastModul = newModuls[newModuls.length - 1];
    if (lastModul !== '') {
      setNewModuls([...newModuls, '']);
    } else {
      alert('Isi modul sebelum menambahkan yang baru.');
    }
  };

  const handleModulChange = (index: number, value: string) => {
    // Mengganti nilai input modul pada indeks tertentu
    const updatedModuls = [...newModuls];
    updatedModuls[index] = value;
    setNewModuls(updatedModuls);
  };

  return (
    <MainLayout
      withNavbar={true}
      withTitle={true}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
      title='Kelola Modul'
    >
      <section className='bg-darkGrey-800 relative h-screen w-screen overflow-y-auto text-orange-600'>
        <div className=' pb-12 pt-28'>
          {/* <FormProvider {...methods}> */}
          <div
            // onSubmit={handleSubmit(onSubmit)}
            className='bg-darkGrey-800 container mx-auto mt-6 flex w-screen flex-col gap-6 rounded-3xl border border-orange-600 p-6'
          >
            <div className=' flex w-full flex-col gap-4'>
              <h3>Judul Modul</h3>
              {/* <div className='flex w-full flex-row justify-between rounded-full border border-orange-600 bg-transparent px-4 py-2  font-bold'> */}
              {/* <h3>P1: Logika Dasar</h3>
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
                </div> */}
              <input
                type='text'
                name='modul'
                id='modul'
                className='w-full rounded-full border border-orange-600 bg-transparent px-4 py-3 font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                value='P1: Logika Dasar'
                required
              />
              {/* </div> */}

              <input
                type='text'
                name='modul'
                id='modul'
                className='w-full rounded-full border border-orange-600 bg-transparent px-4 py-3 font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                value='P2: Rangkaian Flip Flop'
                required
              />

              {newModuls.map((modul, index) => (
                <input
                  key={index}
                  type='text'
                  name='modul'
                  id='modul'
                  className='w-full rounded-full border border-orange-600 bg-transparent px-4 py-3 font-bold placeholder:text-orange-600 placeholder:opacity-60 focus:border-none focus:outline-none focus:ring-2 focus:ring-orange-600 '
                  placeholder={`Masukkan modul `}
                  value={modul}
                  onChange={(e) => handleModulChange(index, e.target.value)}
                  required
                />
              ))}
            </div>

            <div className='flex justify-end'>
              <IconButton
                onClick={handleAddSection}
                variant='dark'
                className='h-[40px] w-[100px] rounded-full border-none text-orange-600'
                icon={FaPlus}
              />
            </div>
            <div className='mt-12 flex w-full justify-end'>
              <Button
                type='submit'
                className='h-[40px] w-[100px] rounded-full  border-none bg-black px-6 text-orange-600'
              >
                Simpan
              </Button>
            </div>
          </div>
          {/* </FormProvider> */}
        </div>
      </section>
    </MainLayout>
  );
}
