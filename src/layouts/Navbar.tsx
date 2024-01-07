'use client';


import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BiSolidUser } from 'react-icons/bi';
import { IoMdNotifications } from 'react-icons/io';
import { IoArrowBackOutline } from 'react-icons/io5';
import { MdDateRange } from 'react-icons/md';

import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';

import useAuthStore from '@/stores/useAuthStore';

type NavbarProps = {
  title?: string;
  withDropdown?: boolean;
  withBackButton?: boolean;
  withRightNav?: boolean;
  withTitle?: boolean;
  role?: string;
};

const defaultTitle = 'PRAMASTI';


const Navbar = ({
  title = defaultTitle,
  withTitle = false,
  withDropdown = false,
  withBackButton = false,
  withRightNav = false,
}: NavbarProps) => {
  const router = useRouter();
  const user = useAuthStore.useUser();

  const handleNotification = () => {
    if (user?.roles[0] === 'admin') {
      router.push('/pengumuman-admin');
    } else if (user?.roles[0] === 'praktikan' && user?.roles[1] === 'koordinator' ){
       router.push('/home-koor/pengumuman-koor');
    }else if (user?.roles[0] === 'praktikan' && user?.roles[1] === 'dosen'|| user?.roles[0] === 'dosen' ) {
      router.push('/home-dosen/pengumuman-dosen');
    }
    else {
      router.push('/pengumuman');
    }
  };

  const handleJadwal = () => {
    if (user?.roles[0] === 'praktikan' && user?.roles[1] !== 'asisten') {
      router.push('/jadwal');
    } else if (user?.roles[1] === 'asisten') {
      router.push('/jadwal-asisten');
    }
  };

  const [selectedRole, setSelectedRole] = useState(user?.roles[1]);
  const handleRoleChange = (selectedRole: string) =>{
  setSelectedRole(selectedRole); // Update state dengan role terpilih 

    if (selectedRole === 'praktikan') {
      router.push('/home'); // Change the route accordingly
    } else if (selectedRole === 'dosen') {
      router.push('/home-dosen'); // Change the route accordingly
    }else if (selectedRole === 'koordinator') {
      router.push('/home-koor'); // Change the route accordingly
    } else if (selectedRole === 'admin') {
      router.push('/home-admin'); // Change the route accordingly
    }else if (selectedRole === 'asisten') {
      router.push('/home-asisten'); // Change the route accordingly
    }
    
  };

  return (
    <nav className='fixed top-0 z-20  w-full'>
      <div className='mx-16 flex flex-row items-center justify-between p-4'>
        <div className='flex flex-row items-center justify-center gap-4'>
          {withBackButton && (
            <Button
              onClick={() => router.back()}
              className='bg-darkGrey-600 rounded-3xl p-2 '
            >
              <IoArrowBackOutline size={40} className='text-orange-600' />
            </Button>
          )}

      {withTitle || withDropdown ? (
            <div className='bg-darkGrey-600 flex flex-row gap-4 rounded-full px-6 py-4 uppercase text-orange-600'>
              {withTitle && <h2>{title}</h2>}
              <div className='relative bg-darkGrey-600'>
                {withDropdown && (
                  <select
                    onChange={(e) => handleRoleChange(e.target.value)}
                    value={selectedRole} // Gunakan state selectedRole sebagai value
                    className='rounded-full border-orange-600 text-orange-600 bg-darkGrey-600'
                  >
                    {user?.roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ) : null}        </div>
              {/* {withDropdown && user?.roles[0] === 'praktikan' &&
                user?.roles[1] !== 'asisten' && 
                user?.roles[1] !== 'dosen' && 
                user?.roles[1] !== 'koordinator' && ( 
               <select
                    {...register('judul_modul', {
                      required: true,
                    })}
                    name='judul_modul'
                    id='judul_modul'
                    className='bg-darkGrey-800'
                    placeholder= {user?.roles[0]}
                  >
                    {dataJadwal?.map((jadwal) => {
                      return (
                        <option
                          value={jadwal.judul_modul}
                          key={jadwal.id_modul}
                        >
                          {jadwal.judul_modul}
                        </option>
                      );
                    })}
               </select>
                  )} */}

        {withRightNav && (
          <ul className='bg-darkGrey-600 flex flex-row justify-around gap-4 rounded-full px-6 py-4 '>
            {user?.roles.includes('admin') || user?.roles.includes('dosen') || user?.roles.includes('koordinator') ? null : (
             (
              <Button
                onClick={handleJadwal}
                variant='ghost'
                className='!m-0 !p-0'
              >
                <li className=''>
                  <MdDateRange size={34} className='text-orange-600' />
                </li>
              </Button>
             )
            )}
            
            <Button
              onClick={handleNotification}
              variant='ghost'
              className='!m-0 !p-0'
            >
              <li className=''>
                <IoMdNotifications size={34} className='text-orange-600' />
              </li>
            </Button>

            <ButtonLink href='/profile' variant='ghost' className='!m-0 !p-0'>
            <li className=''>
                <BiSolidUser size={34} className='text-orange-600' />
              </li>
            </ButtonLink>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
