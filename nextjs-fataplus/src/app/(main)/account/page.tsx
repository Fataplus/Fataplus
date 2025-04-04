import { Metadata } from 'next';
import { getAuthUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import AccountProfile from '@/components/account/AccountProfile';
import AccountTabs from '@/components/account/AccountTabs';

export const metadata: Metadata = {
  title: 'My Account | FataPlus',
  description: 'Manage your FataPlus account',
};

export default async function AccountPage() {
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login?redirectUrl=/account');
  }
  
  return (
    <MainLayout title="My Account">
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
          <AccountProfile user={user} />
          <AccountTabs user={user} />
        </div>
      </div>
    </MainLayout>
  );
}
