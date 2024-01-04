import NextImage from 'next/image';

export default function Background2() {
  return (
    <>
      <NextImage
        src='/images/home/left_decor.png'
        width={593}
        height={38}
        alt='black circle'
        className='absolute left-0 top-0 z-0 h-auto w-[35%]'
      />
      <NextImage
        src='/images/home/top_decor.png'
        width={129}
        height={67}
        alt='yellow circle'
        className='absolute right-48 top-0 z-0 h-auto w-[10%]'
      />
      <NextImage
        src='/images/home/right_decor.png'
        width={29}
        height={130}
        alt='grey circle'
        className='absolute right-0 top-48 z-0 h-[20%] w-auto'
      />
      <NextImage
        src='/images/home/bottom_decor.png'
        width={225}
        height={95}
        alt='white circle'
        className='absolute bottom-0 left-80 z-0 h-auto w-[18%]'
      />
    </>
  );
}
