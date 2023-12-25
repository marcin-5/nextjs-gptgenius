import { fetchOrGenerateTokens } from '@/utils/action';
import { UserButton, auth, currentUser } from '@clerk/nextjs';

const MemberProfile = async () => {
  const user = await currentUser();
  // const { userId } = auth();
  const emailAddress = user.emailAddresses[0].emailAddress;
  await fetchOrGenerateTokens(emailAddress);

  return (
    <div className='flex gap-2 items-center px-4'>
      <UserButton afterSignOutUrl='/' />
      <p>{emailAddress}</p>
    </div>
  );
};

export default MemberProfile;
