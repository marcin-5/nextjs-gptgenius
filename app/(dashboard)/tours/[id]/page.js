import TourInfo from '@/app/components/TourInfo';
import { getSingleTour } from '@/utils/action';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const SingleTourPage = async ({ params }) => {
  const tour = await getSingleTour(params.id);
  if (!tour) redirect('/tours');

  return (
    <div>
      <Link href='/tours' className='mb-12 btn btn-secondary'>
        back to tours
      </Link>
      <TourInfo tour={tour} />
    </div>
  );
};

export default SingleTourPage;
