'use client';

import { fetchUserTokensByEmail, generateChatResponse, subtractTocens } from '@/utils/action';
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BsRobot } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';

const Chat = () => {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const { mutate: createMessage, isPending } = useMutation({
    mutationFn: async (query) => {
      const emailAddress = user.emailAddresses[0].emailAddress;
      const currentTokens = await fetchUserTokensByEmail(emailAddress);
      if (currentTokens < 100) {
        toast.error('Token balance too low...');
        return;
      }

      const response = await generateChatResponse([...messages, query]);
      if (!response) {
        toast.error('Something went wrong...');
        return;
      }
      setMessages((items) => [...items, response.message]);
      const newTokens = await subtractTocens(emailAddress, response.tokens);
      toast.success(`${newTokens} tokens remaining...`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = { role: 'user', content: text };
    createMessage(query);
    setMessages((items) => [...items, query]);
    setText('');
  };

  return (
    <div className='min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]'>
      <div>
        {messages.map(({ role, content }, index) => {
          const avatar = role == 'user' ? <FaRegUser /> : <BsRobot />;
          const bcg = role == 'user' ? 'bg-base-200' : 'bg-base-100';
          return (
            <div
              key={index}
              className={`flex px-8 py-6 -mx-8 text-xl leading-loose border-b ${bcg} border-base-300`}
            >
              <span className='mt-2 mr-4'>{avatar}</span>
              <p className='max-w-3xl'>{content}</p>
            </div>
          );
        })}
        {isPending && <span className='loading'></span>}
      </div>
      <form onSubmit={handleSubmit} className='pt-12 max-w-4xl'>
        <div className='w-full join'>
          <input
            type='text'
            placeholder='Message GeniusGPT'
            className='w-full input input-bordered join-item'
            onChange={(e) => setText(e.target.value)}
            value={text}
            required
          />
          <button
            className='btn btn-primary join-item'
            type='submit'
            disabled={isPending}
          >
            {isPending ? 'please wait...' : 'ask question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
