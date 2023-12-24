'use client';

import { getAllTours } from '@/utils/action';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ToursList from './ToursList';

const ToursPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const { data, isPending } = useQuery({
    queryKey: ['tours', searchValue],
    queryFn: () => getAllTours(searchValue),
  });
  return (
    <>
      <form className='mb-12 max-w-lg'>
        <div className='join w-fill'>
          <input
            type='text'
            placeholder='enter city or country here...'
            className='w-full input input-bordered join-item'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
          />
          <button
            className='btn btn-primary join-item'
            type='button'
            disabled={isPending}
            onClick={() => setSearchValue('')}
          >
            {isPending ? 'please wait...' : 'reset'}
          </button>
        </div>
      </form>
      {isPending ? (
        <span className='loading'></span>
      ) : (
        <ToursList data={data} />
      )}
    </>
  );
};

export default ToursPage;
