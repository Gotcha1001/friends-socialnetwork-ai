import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/configs/db';
import { profiles, users } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import ProfileClient from '../components/ProfileClient';

async function Profile() {
    const clerkUser = await currentUser();
    const userId = clerkUser?.id;
    console.log('Profile: userId from currentUser()', userId);
    if (!userId) {
        console.log('Profile: Redirecting to /sign-in due to missing userId');
        redirect('/sign-in');
    }

    const user = await db
        .select({
            id: users.id,
            username: users.username,
            name: users.name,
            email: users.email,
        })
        .from(users)
        .where(eq(users.clerkId, userId))
        .execute();
    console.log('Profile: Database user query result', user);

    if (!user.length) {
        console.log('Profile: Redirecting to /sign-in due to user not found');
        redirect('/sign-in');
    }

    const profileData = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user[0].id))
        .execute();

    return <ProfileClient userData={user[0]} profileData={profileData[0] || null} />;
}

module.exports = Profile;