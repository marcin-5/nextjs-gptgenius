'use client';

import { generateChatResponse } from '@/utils/action';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Chat = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const { mutate: createMessage } = useMutation({
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
  console.log(messages);
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
