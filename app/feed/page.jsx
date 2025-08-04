import { db } from '@/configs/db';
import { posts, users } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server'; // Replaced auth with currentUser
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function Feed() {
    const clerkUser = await currentUser(); // Use currentUser to get authenticated user
    const userId = clerkUser?.id;

    if (!userId) {
        console.log('Feed: Redirecting to /sign-in due to missing userId');
        redirect('/sign-in');
    }

    const postList = await db
        .select({
            id: posts.id,
            content: posts.content,
            createdAt: posts.createdAt,
            username: users.username,
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .orderBy(posts.createdAt)
        .execute();

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-500/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-purple-100">Main Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {postList.length === 0 && (
                            <p className="text-purple-200 text-center">No posts yet.</p>
                        )}
                        {postList.map((post) => (
                            <div
                                key={post.id}
                                className="p-4 bg-gradient-to-r from-purple-700/50 to-blue-700/50 rounded-lg border border-purple-400/30"
                            >
                                <p className="font-semibold text-purple-100">{post.username}</p>
                                <p className="text-purple-200">{post.content}</p>
                                <p className="text-purple-300 text-sm">
                                    {new Date(post.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Feed;