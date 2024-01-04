import NextImage from 'next/image';

export default function Background1() {
  return (
    <>
      <NextImage
        src='/images/login/top_left_decor.png'
        width={215}
        height={425}
        alt='top left decoration'
        className='absolute left-0 top-0 z-0 h-[40%] w-auto'
      />

      <NextImage
        src='/images/login/top_right_decor.png'
        width={353}
        height={301}
        alt='top right decoration'
        className='absolute right-0 top-0 z-0 h-[30%] w-auto'
      />

      <NextImage
        src='/images/login/bottom_right_decor.png'
        width={473}
        height={306}
        alt='bottom right decoration'
        className='absolute bottom-0 right-0 z-0 h-[40%] w-auto'
      />

      <NextImage
        src='/images/login/bottom_left_decor.png'
        width={178}
        height={157}
        alt='bottom left decoration'
        className='absolute bottom-12 left-12 z-0 h-[20%] w-auto'
      />
    </>
  );
}
