'use client';

import {
  createNewTour,
  fetchUserTokensByEmail,
  generateTourResponse,
  getExistingTour,
  subtractTocens,
} from '@/utils/action';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import TourInfo from './TourInfo';

const NewTour = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);
      if (existingTour) return existingTour;

      const emailAddress = user.emailAddresses[0].emailAddress;
      const currentTokens = await fetchUserTokensByEmail(emailAddress);
      if (currentTokens < 300) {
        toast.error('Token balance too low...');
        return null;
      }

      const newTour = await generateTourResponse(destination);
      if (!newTour) {
        toast.error('No matching city found...');
        return null;
      }

      const response = await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      const newTokens = await subtractTocens(emailAddress, newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
      return newTour.tour;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(formData.entries());
    mutate(destination);
  };

  if (isPending) {
    return <span className='loading loading-lg'></span>;
  }
  return (
    <>
      <form onSubmit={handleSubmit} className='max-w-2xl'>
        <h2 className='mb-4'>Select your dream destination</h2>
        <div className='w-full join'>
          <input
            type='text'
            className='w-full input input-bordered join-item'
            placeholder='city'
            name='city'
            required
          />
          <input
            type='text'
            className='w-full input input-bordered join-item'
            placeholder='country'
            name='country'
            required
          />
          <button className='btn btn-primary join-item' type='submit'>
            generate tour
          </button>
        </div>
      </form>
      <div className='mt-16'>{tour ? <TourInfo tour={tour} /> : null}</div>
    </>
  );
};

export default NewTour;
