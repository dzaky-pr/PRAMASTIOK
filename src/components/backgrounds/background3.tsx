import NextImage from 'next/image';

export default function Background3() {
  return (
    <>
      <NextImage
        src='/images/profile/decor.png'
        width={152}
        height={151}
        alt='decoration'
        className='absolute left-12 top-12 z-0 h-[15%] w-auto'
      />

      <NextImage
        src='/images/profile/bottom_left_decor.png'
        width={193}
        height={143}
        alt='decoration'
        className='absolute bottom-0 left-0 z-0 h-[15%] w-auto'
      />

      <NextImage
        src='/images/profile/decor_black.png'
        width={121}
        height={120}
        alt='decoration'
        className='absolute left-[35%] top-[50%] z-0 h-[15%] w-auto'
      />

      <NextImage
        src='/images/profile/top_decor.png'
        width={221}
        height={192}
        alt='decoration'
        className='absolute left-[35%] top-0 z-0 h-[20%] w-auto'
      />

      <NextImage
        src='/images/profile/top_right_decor.png'
        width={268}
        height={156}
        alt='decoration'
        className='absolute right-0 top-0 z-0 h-[20%] w-auto'
      />

      <NextImage
        src='/images/profile/bottom_decor.png'
        width={447}
        height={280}
        alt='decoration'
        className='absolute bottom-0 right-[20%] z-0 h-[30%] w-auto'
      />
    </>
  );
}
