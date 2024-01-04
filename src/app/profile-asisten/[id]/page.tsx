'use client';

import NextImage from 'next/image';
import * as React from 'react';

import api from '@/lib/api';
import { getAccessToken } from '@/lib/cookies';

import Background3 from '@/components/backgrounds/background3';
import withAuth from '@/components/hoc/withAuth';

import MainLayout from '@/layouts/MainLayout';

import { ApiReturn } from '@/types/api';

type ProfileAsisten = {
  user_id: number;
  name: string;
  nrp: string;
  departemen: string;
  nohp: string;
  email: string;
  profile_picture: string;
};

export default withAuth(ProfileAsisten, ['authed']);
function ProfileAsisten({ params }: { params: { id: string } }) {
  const token = getAccessToken();
  const [dataProfileAsisten, setDataProfileAsisten] =
    React.useState<ProfileAsisten>();

  const LoadPraktikum = React.useCallback(async () => {
    const res = await api.get<ApiReturn<ProfileAsisten>>(
      `/user/profile-asisten/${params.id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (!res.data.data) {
      return;
    }
    return setDataProfileAsisten(res.data.data);
  }, [params.id, token]);

  React.useEffect(() => {
    LoadPraktikum();
  }, [LoadPraktikum]);

  return (
    <MainLayout
      withNavbar={true}
      withTitle={false}
      withDropdown={false}
      withRightNav={false}
      withBackButton={true}
    >
      <section className='bg-darkGrey-800 relative flex h-screen w-screen'>
        <Background3 />

        <div className='z-10 flex w-screen flex-row items-center justify-center gap-24'>
          <div className='flex flex-col items-center justify-center gap-2 text-center text-orange-600'>
            <h1 className='uppercase'>{dataProfileAsisten?.name}</h1>
            <h2>{dataProfileAsisten?.nohp}</h2>
            <h2 className='uppercase'>{dataProfileAsisten?.departemen}</h2>
            <div className='flex flex-row gap-2'>
              <div className='flex flex-row items-center gap-2'>
                <NextImage
                  src='/images/profile/square.png'
                  width={29}
                  height={28}
                  alt='square'
                  className='h-auto w-auto'
                />
                <h3>{dataProfileAsisten?.nohp}</h3>
              </div>

              <span className='bg-lightGrey-600 h-16 w-1 rounded-full'></span>

              <div className='flex flex-row items-center gap-2'>
                <NextImage
                  src='/images/profile/message.png'
                  width={33}
                  height={28}
                  alt='message'
                  className='h-auto w-auto'
                />
                <h3>{dataProfileAsisten?.email}</h3>
              </div>
            </div>
          </div>
          <span className='bg-lightGrey-600 h-[60%] w-2  rounded-full'></span>
          <NextImage
            src={
              dataProfileAsisten?.profile_picture ??
              '/images/profile/photo.jpeg'
            }
            width={382}
            height={439}
            alt='people'
            className='h-[40%] w-auto'
          />
        </div>
      </section>
    </MainLayout>
  );
}
