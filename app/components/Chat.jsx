'use client';

import { generateChatResponse } from '@/utils/action';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BsRobot } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';

const Chat = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const { mutate: createMessage, isPending } = useMutation({
    mutationFn: (query) => generateChatResponse([...messages, query]),
    onSuccess: (data) => {
      if (!data) {
        toast.error('Something went wrong...');
        return;
      }
      setMessages((items) => [...items, data]);
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
