import TourInfo from '@/app/components/TourInfo';
import { generateTourImage, getSingleTour } from '@/utils/action';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const SingleTourPage = async ({ params }) => {
  const tour = await getSingleTour(params.id);
  if (!tour) redirect('/tours');

  const tourImage = await generateTourImage({
    city: tour.city,
    country: tour.country,
  });

  return (
    <div>
      <Link href='/tours' className='mb-12 btn btn-secondary'>
        back to tours
      </Link>
      {tourImage ? (
        <div>
          <Image
            src={tourImage}
            width={300}
            height={300}
            className='object-cover mb-16 w-96 h-96 rounded-xl shadow-xl'
            alt={tour.title}
            priority
          />
        </div>
      ) : null}
      <TourInfo tour={tour} />
    </div>
  );
};

export default SingleTourPage;
