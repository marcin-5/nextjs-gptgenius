'use server';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';
import prisma from './db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a helpful assistant' },
        ...chatMessages,
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
      max_tokens: 100,
    });
    return response.choices[0].message;
  } catch (error) {
    return null;
  }
};

export const generateTourResponse = async ({ city, country }) => {
  const query = `Find a exact ${city} in this exact ${country}.
  If ${city} and ${country} exist, create a list of things families can do in this ${city},${country}. 
  Once you have a list, create a one-day tour. Response should be  in the following JSON format: 
  {
    "tour": {
      "city": "${city}",
      "country": "${country}",
      "title": "title of the tour",
      "description": "short description of the city and tour",
      "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
    }
  }
  "stops" property should include only three stops.
  If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country},   return { "tour": null }, with no additional characters.`;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a tour guide' },
        { role: 'user', content: query },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
    });
    const tourData = JSON.parse(response.choices[0].message.content);
    return tourData.tour;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getExistingTour = async ({ city, country }) => {
  return prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
};

export const createNewTour = async (tour) => {
  return prisma.tour.create({
    data: tour,
  });
};

export const getAllTours = async (searchTerm) => {
  const args = {
    orderBy: {
      city: 'asc',
    },
  };

  if (searchTerm) {
    args.where = {
      OR: [
        {
          city: {
            contains: searchTerm,
          },
        },
        {
          country: {
            contains: searchTerm,
          },
        },
      ],
    };
  }
  console.log('args: ', args);
  return await prisma.tour.findMany(args);
};

export const getSingleTour = async (id) => {
  return prisma.tour.findUnique({
    where: {
      id,
    },
  });
};

export const generateTourImage = async ({ city, country }) => {
  try {
    const tourImage = await openai.images.generate({
      prompt: `a panoramic view of the ${city} ${country}`,
      n: 1,
      size: '512x512',
    });
    return tourImage?.data[0]?.url;
  } catch (error) {
    return null;
  }
};

export const fetchUserTokensByEmail = async (email) => {
  const result = await prisma.token.findUnique({
    where: {
      email,
    },
  });
  return result?.tokens;
};

export const generateUserTokensForEmail = async (email) => {
  const result = await prisma.token.create({
    data: {
      email,
    },
  });
  return result?.tokens;
};

export const fetchOrGenerateTokens = async (email) => {
  const result = await fetchUserTokensByEmail(email);
  if (result) return result;
  return (await generateUserTokensForEmail(email));
};

export const subtractTocens = async (email, tokens) => {
  const result = await prisma.token.update({
    where: {
      email,
    },
    data: {
      tokens: {
        decrement: tokens,
      },
    },
  });
  revalidatePath('/profile');
  return result.tokens;
};
