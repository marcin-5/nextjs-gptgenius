import Link from 'next/link';

const TourCard = ({ tour }) => {
  const { city, id, country } = tour;
  return (
    <Link
      href={`/tours/${id}`}
      className='rounded-xl card card-compact bg-base-100'
    >
      <div className='items-center text-center card-body'>
        <h2 className='text-lg==xl text-center card-title'>
          {city}, {country}
        </h2>
      </div>
    </Link>
  );
};

export default TourCard;
