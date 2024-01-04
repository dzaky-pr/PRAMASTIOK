import Background2 from '@/components/backgrounds/background2';

import MainLayout from '@/layouts/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <section className='bg-lightGrey-800 relative h-screen w-screen'>
        <Background2 />
      </section>
    </MainLayout>
  );
}
