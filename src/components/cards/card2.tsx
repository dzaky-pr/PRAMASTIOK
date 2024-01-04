import { PengumumanType } from '@/types/entities/pengumuman';

export default function Card2({ judul, deskripsi, className }: PengumumanType) {
  return (
    <div
      className={`border-1 z-10 flex flex-col gap-1 rounded-3xl border border-orange-600 p-4 text-orange-600 ${className} w-full`}
    >
      <h2>{judul}</h2>
      <p>{deskripsi}</p>
    </div>
  );
}
