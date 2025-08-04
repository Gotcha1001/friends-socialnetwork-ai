'use client';

const { Button } = require('@/components/ui/button');
const { Card, CardContent, CardHeader, CardTitle } = require('@/components/ui/card');
const { useState } = require('react');
const { useRouter } = require('next/navigation');

function CreatePostClient() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();
            if (response.ok) {
                setContent('');
                router.push('/feed');
            } else {
                setError(data.error || 'Failed to create post');
            }
        } catch (err) {
            setError('Failed to create post');
        }
        setLoading(false);
    }

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-500/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-purple-100">Create a Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full bg-purple-900/50 text-purple-100 p-2 rounded border border-purple-400/30"
                                rows="5"
                            />
                        </div>
                        {error && <p className="text-pink-400">{error}</p>}
                        <Button
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

module.exports = CreatePostClient;