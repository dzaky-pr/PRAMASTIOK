import NextImage from 'next/image';

import ButtonLink from '@/components/links/ButtonLink';

import { PraktikumType } from '@/app/home/page';

export default function Card1({
  praktikum_name,
  deskripsi,
  logo_praktikum,
  className,
  praktikum_id,
  nilai,
}: PraktikumType) {
  return (
    <div
      className={`flex flex-row items-center justify-center gap-6 text-orange-600 ${className}  z-10`}
    >
      <div className='border-1 z-10 flex h-[260px] w-[260px] border border-white'>
        <NextImage
          src={`${logo_praktikum}`}
          width={308}
          height={332}
          alt='praktikum'
          className=' z-10 h-full w-full object-cover'
        />
      </div>

      <div className={`${className} z-10 flex w-[60%] flex-col gap-2`}>
        <h2>{praktikum_name}</h2>
        <p>{deskripsi}</p>
      </div>

      <div className='z-10 flex  flex-col gap-4'>
        <ButtonLink
          href={`/home/${praktikum_id}/ambil-jadwal`}
          className='w-[200px] justify-center rounded-full bg-white px-4 py-4 font-bold text-black'
        >
          Ambil
        </ButtonLink>
        <div className='w-[200px] justify-center rounded-full bg-white px-4 py-4 text-center font-bold text-black'>
          {nilai === null ? 'Belum ada nilai akhir' : nilai}
        </div>
      </div>
    </div>
  );
}
