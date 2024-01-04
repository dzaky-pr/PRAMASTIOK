'use client';

import { useRouter } from 'next/navigation';
import { BiSolidUser } from 'react-icons/bi';
import { IoMdNotifications } from 'react-icons/io';
import { IoArrowBackOutline } from 'react-icons/io5';
import { MdDateRange } from 'react-icons/md';
import { VscTriangleDown } from 'react-icons/vsc';

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
    } else {
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
            <div className='bg-darkGrey-600  flex flex-row gap-4  rounded-full px-6 py-4 uppercase text-orange-600'>
              {withTitle && <h2>{title}</h2>}

              {withDropdown &&
                user?.roles[0] === 'praktikan' &&
                user?.roles[1] !== 'asisten' && (
                  <Button
                    rightIcon={VscTriangleDown}
                    variant='outline'
                    className='flex flex-row justify-between rounded-full border-orange-600  text-orange-600'
                  >
                    {user?.roles[0]}
                  </Button>
                )}

              {withDropdown &&
                user?.roles[0] === 'praktikan' &&
                user?.roles[1] === 'asisten' && (
                  <Button
                    rightIcon={VscTriangleDown}
                    variant='outline'
                    className='flex flex-row justify-between rounded-full border-orange-600  text-orange-600'
                  >
                    {user?.roles[1]}
                  </Button>
                )}

              {withDropdown && user?.roles[0] === 'admin' && (
                <Button
                  variant='outline'
                  className=' flex flex-row justify-between rounded-full  border-orange-600 text-orange-600'
                >
                  {user?.roles[0]}
                </Button>
              )}
            </div>
          ) : null}
        </div>

        {withRightNav && (
          <ul className='bg-darkGrey-600 flex flex-row justify-around gap-4 rounded-full px-6 py-4 '>
            {user?.roles[0] !== 'admin' && (
              <Button
                onClick={handleJadwal}
                variant='ghost'
                className='!m-0 !p-0'
              >
                <li className=''>
                  <MdDateRange size={34} className='text-orange-600' />
                </li>
              </Button>
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
