'use client';

const { Button } = require('@/components/ui/button');
const { Card, CardContent, CardHeader, CardTitle } = require('@/components/ui/card');
const { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } = require('@/components/ui/dialog');
const { CldImage } = require('next-cloudinary');
const { useState } = require('react');

function ProfileClient({ userData, profileData }) {
    const [profile, setProfile] = useState(profileData);
    const [bio, setBio] = useState(profileData?.bio || '');
    const [location, setLocation] = useState(profileData?.location || '');
    const [interests, setInterests] = useState(profileData?.interests || []);
    const [newInterest, setNewInterest] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('bio', bio);
            formData.append('location', location);
            formData.append('interests', JSON.stringify(interests));
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const response = await fetch('/api/profile', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setProfile(data.profile);
                setProfileImage(null);
            } else {
                console.error('Error updating profile:', data.error);
            }
        } catch (error) {
            console.error('Error submitting profile:', error);
        }
        setLoading(false);
    }

    function handleAddInterest() {
        if (newInterest && !interests.includes(newInterest)) {
            setInterests([...interests, newInterest]);
            setNewInterest('');
        }
    }

    function handleRemoveInterest(interest) {
        setInterests(interests.filter((i) => i !== interest));
    }

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-500/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-purple-100">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            {profile && profile.profileImage ? (
                                <CldImage
                                    src={profile.profileImage}
                                    alt="Profile"
                                    width={150}
                                    height={150}
                                    className="rounded-full border-2 border-purple-400/50"
                                />
                            ) : (
                                <div className="w-36 h-36 bg-purple-700/50 rounded-full flex items-center justify-center text-purple-200">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-purple-100 font-semibold">Username: {userData.username}</p>
                            <p className="text-purple-100">Name: {userData.name}</p>
                            <p className="text-purple-100">Email: {userData.email}</p>
                            <p className="text-purple-100 mt-4">Bio: {profile?.bio || 'Not set'}</p>
                            <p className="text-purple-100">Location: {profile?.location || 'Not set'}</p>
                            <p className="text-purple-100">Interests: {profile?.interests?.length ? profile.interests.join(', ') : 'None'}</p>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white">
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gradient-to-r from-purple-800/80 to-blue-800/80 text-purple-100">
                            <DialogHeader>
                                <DialogTitle>Update Profile</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-purple-200">Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-purple-900/50 text-purple-100 p-2 rounded border border-purple-400/30"
                                        rows="4"
                                    />
                                </div>
                                <div>
                                    <label className="text-purple-200">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-purple-900/50 text-purple-100 p-2 rounded border border-purple-400/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-purple-200">Interests</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newInterest}
                                            onChange={(e) => setNewInterest(e.target.value)}
                                            className="w-full bg-purple-900/50 text-purple-100 p-2 rounded border border-purple-400/30"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddInterest}
                                            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {interests.map((interest) => (
                                            <div
                                                key={interest}
                                                className="bg-purple-700/50 text-purple-100 px-3 py-1 rounded-full flex items-center gap-2"
                                            >
                                                {interest}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInterest(interest)}
                                                    className="text-pink-400"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-purple-200">Profile Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setProfileImage(e.target.files[0])}
                                        className="w-full bg-purple-900/50 text-purple-100 p-2 rounded border border-purple-400/30"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                                >
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}

module.exports = ProfileClient;