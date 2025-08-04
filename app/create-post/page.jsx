const { auth } = require('@clerk/nextjs/server');
const { redirect } = require('next/navigation');
const CreatePostClient = require('../components/CreatePostClient');


async function CreatePost() {
    const { userId } = auth();
    if (!userId) {
        console.log('CreatePost: Redirecting to /sign-in due to missing userId');
        redirect('/sign-in');
    }

    return <CreatePostClient />;
}

module.exports = CreatePost;