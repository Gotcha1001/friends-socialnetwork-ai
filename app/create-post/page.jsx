// app/create-post/page.jsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CreatePostClient from '../components/CreatePostClient';

export default async function CreatePost() {
    const clerkUser = await currentUser();
    const userId = clerkUser?.id;
    console.log('CreatePost: userId from currentUser()', userId);

    if (!userId) {
        console.log('CreatePost: Redirecting to /sign-in due to missing userId');
        redirect('/sign-in');
    }

    return <CreatePostClient />;
}