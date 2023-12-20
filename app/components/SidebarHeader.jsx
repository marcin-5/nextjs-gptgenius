import { SiOpenaigym } from 'react-icons/si';
import ThemeToggle from './ThemeToggle';

const SidebarHeader = () => {
  return (
    <div className='flex gap-4 items-center px-4 mb-4'>
      <SiOpenaigym className='w-10 h-10 text-primary' />
      <h2 className='mr-auto font-extrabold test-xl text-primary'>GPTGenius</h2>
      <ThemeToggle />
    </div>
  );
};

export default SidebarHeader;
