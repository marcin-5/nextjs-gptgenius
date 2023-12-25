import { fetchUserTokensByEmail } from '@/utils/action';
import { UserProfile, currentUser } from '@clerk/nextjs';

const ProfilePage = async () => {
  const user = await currentUser();
  const currentTokens = await fetchUserTokensByEmail(
    user.emailAddresses[0].emailAddress
  );

  return (
    <div>
      <h2 className='mb-8 ml-8 font-extrabold trxt-xl'>
        Token Amount: {currentTokens}
      </h2>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
