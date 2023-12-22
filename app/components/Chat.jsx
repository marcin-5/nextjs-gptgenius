'use client';

import { generateChatResponse } from '@/utils/action';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const Chat = () => {
  const [text, setText] = useState('');
  const [message, setMessage] = useState([]);
  const { mutate: createMessage } = useMutation({
    mutationFn: (message) => generateChatResponse(message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMessage(text);
  };

  return (
    <div className='min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]'>
      <div>
        <h2 className='text-5xl'>messages</h2>
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
          <button className='btn btn-primary join-item' type='submit'>
            ask question
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
