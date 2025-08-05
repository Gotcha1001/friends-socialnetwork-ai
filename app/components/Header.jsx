'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
import { Users, Brain, ShieldCheck, Plus, MessageCircle, Menu, X, Sparkles, Search, Bell, Zap, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
    const { user, isSignedIn, isLoaded } = useUser(); // Added isLoaded
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    console.log("USER:", user)

    useEffect(() => {
        if (isSignedIn && user) {
            user.reload().then(() => {
                console.log("User reloaded, publicMetadata:", user?.publicMetadata);
            });
        }
    }, [isSignedIn, user]);

    if (isSignedIn) {
        console.log("User publicMetadata:", user?.publicMetadata);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gradient-to-r from-purple-900/85 via-blue-900/85 to-indigo-900/85 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl p-2 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <Brain className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 via-cyan-200 to-pink-200 bg-clip-text text-transparent">
                        FriendAI
                    </span>
                </Link>

                <button
                    className="md:hidden text-purple-200 hover:text-white transition-colors duration-200"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>

                <nav className="hidden md:flex items-center gap-3">
                    <SignedIn>
                        <Link href="/profile">
                            <Button className="bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-purple-400/20 backdrop-blur-sm">
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </Button>
                        </Link>
                        <Link href="/discover">
                            <Button className="bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-purple-400/20 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Discover
                            </Button>
                        </Link>
                        <Link href="/feed">
                            <Button className="bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-5和谐 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-purple-400/20 backdrop-blur-sm">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Feed
                            </Button>
                        </Link>
                        <Link href="/ai-suggestions">
                            <Button className="bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-purple-400/20 backdrop-blur-sm">
                                <Brain className="w-4 h-4 mr-2" />
                                AI Match
                            </Button>
                        </Link>
                        <Link href="/create-post">
                            <Button className="bg-gradient-to-r from-pink-600/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-500 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-pink-400/20 backdrop-blur-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Post
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-full p-2"
                            >
                                <Search className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-200 hover:text-white hover:bg-purple-700/50 rounded-full p-2 relative"
                            >
                                <Bell className="w-5 h-5" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                            </Button>
                        </div>
                        {user?.publicMetadata?.admin && (
                            <Link href="/admin">
                                <Button className="bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500 hover:to-red-500 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-orange-400/20 backdrop-blur-sm">
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Admin
                                </Button>
                            </Link>
                        )}
                        {/* Conditionally render UserButton based on isLoaded */}
                        {isLoaded ? (
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-10 h-10 border-2 border-purple-400/50 hover:border-cyan-400/70 transition-colors duration-300",
                                    },
                                }}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-700/50 flex items-center justify-center text-purple-200">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Zap className="w-4 h-4 mr-2" />
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button
                                variant="outline"
                                className="border-2 border-cyan-400 text-cyan-200 hover:bg-cyan-800/30 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                            >
                                Join Now
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                </nav>
            </div>

            {isMenuOpen && (
                <nav className="md:hidden bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-md px-4 py-6 flex flex-col items-stretch gap-3 border-t border-purple-500/20">
                    <SignedIn>
                        <Link href="/profile" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <User className="w-5 h-5 mr-2" />
                                Profile
                            </Button>
                        </Link>
                        <Link href="/discover" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Discover Friends
                            </Button>
                        </Link>
                        <Link href="/feed" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                My Feed
                            </Button>
                        </Link>
                        <Link href="/ai-suggestions" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Brain className="w-5 h-5 mr-2" />
                                AI Recommendations
                            </Button>
                        </Link>
                        <Link href="/create-post" onClick={toggleMenu}>
                            <Button className="w-full bg-gradient-to-r from-pink-600/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Post
                            </Button>
                        </Link>
                        <div className="flex gap-3 mt-2">
                            <Button className="flex-1 bg-purple-700/50 hover:bg-purple-600/60 text-purple-200 py-3 rounded-full font-medium transition-all duration-300">
                                <Search className="w-5 h-5 mr-2" />
                                Search
                            </Button>
                            <Button className="flex-1 bg-purple-700/50 hover:bg-purple-600/60 text-purple-200 py-3 rounded-full font-medium transition-all duration-300 relative">
                                <Bell className="w-5 h-5 mr-2" />
                                Notifications
                                <div className="absolute top-1 right-3 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                            </Button>
                        </div>
                        {user?.publicMetadata?.admin && (
                            <Link href="/admin" onClick={toggleMenu}>
                                <Button className="w-full bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mt-2">
                                    <ShieldCheck className="w-5 h-5 mr-2" />
                                    Admin Panel
                                </Button>
                            </Link>
                        )}
                        <div className="flex justify-center mt-4 pt-4 border-t border-purple-500/20">
                            {/* Conditionally render UserButton for mobile menu */}
                            {isLoaded ? (
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-12 h-12 border-2 border-purple-400/50",
                                        },
                                    }}
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-purple-700/50 flex items-center justify-center text-purple-200">
                                    <User className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Zap className="w-5 h-5 mr-2" />
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button
                                variant="outline"
                                className="w-full border-2 border-cyan-400 text-cyan-200 hover:bg-cyan-800/30 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm mt-2"
                            >
                                <Users className="w-5 h-5 mr-2" />
                                Join Community
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                </nav>
            )}

            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
                <div className="absolute top-0 right-10 w-48 h-48 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-2000"></div>
            </div>
        </header>
    );
}