"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users,
  Sparkles,
  Star,
  ArrowRight,
  Brain,
  MessageCircle,
  Zap,
  Target,
  Coffee,
  Camera,
  Music,
  Gamepad2,
  Book,
  Palette,
} from "lucide-react";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [floatingIcons, setFloatingIcons] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);

  const testimonials = [
    {
      text: "Found my gaming squad and study buddies through AI suggestions. Life-changing connections!",
      author: "Alex K.",
    },
    {
      text: "The AI knew exactly who I'd vibe with. Made 3 best friends in my first week!",
      author: "Jordan M.",
    },
    {
      text: "Smart recommendations helped me find people who share my weird hobbies. Love it!",
      author: "Taylor R.",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Matchmaking",
      desc: "Smart friend suggestions based on your interests",
    },
    {
      icon: MessageCircle,
      title: "Post Advice",
      desc: "Get AI tips to make your posts more engaging",
    },
    {
      icon: Target,
      title: "Interest Mapping",
      desc: "Connect with people who share your passions",
    },
  ];

  const interests = [
    { icon: Coffee, name: "Coffee" },
    { icon: Camera, name: "Photography" },
    { icon: Music, name: "Music" },
    { icon: Gamepad2, name: "Gaming" },
    { icon: Book, name: "Reading" },
    { icon: Palette, name: "Art" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    const iconInterval = setInterval(() => {
      const randomInterest =
        interests[Math.floor(Math.random() * interests.length)];
      const newIcon = {
        id: Date.now(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
        Icon: randomInterest.icon,
      };
      setFloatingIcons((prev) => [...prev.slice(-8), newIcon]);
    }, 2000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(featureInterval);
      clearInterval(iconInterval);
    };
  }, []);

  useEffect(() => {
    const createUserInDatabase = async (retryCount = 0, maxRetries = 3) => {
      if (!isSignedIn || !user) {
        console.log("Home: No user signed in, skipping database insertion");
        return;
      }
      console.log("Home: User data:", {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        retryAttempt: retryCount + 1,
      });
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          credentials: "include",
        });
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Home: Failed to parse JSON response:", {
            status: response.status,
            statusText: response.statusText,
            responseText: await response.text(),
          });
          data = { error: "Invalid JSON response" };
        }
        console.log("Home: API response:", { status: response.status, data });
        if (!response.ok) {
          if (response.status === 405 && retryCount < maxRetries) {
            console.log(
              `Home: Retrying API call (${retryCount + 1}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return createUserInDatabase(retryCount + 1, maxRetries);
          }
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${
              data.error || "Unknown error"
            }`
          );
        }
        console.log("Home: User database operation successful:", data);
      } catch (error) {
        console.error("Home: Error creating/updating user in database:", {
          message: error.message,
          stack: error.stack,
        });
      }
    };

    const timer = setTimeout(() => {
      createUserInDatabase();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSignedIn, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden pt-5">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-2000"></div>

        {/* Floating Interest Icons */}
        {floatingIcons.map((iconObj) => {
          const IconComponent = iconObj.Icon;
          return (
            <div
              key={iconObj.id}
              className="absolute bottom-0 text-cyan-400 opacity-40 animate-bounce"
              style={{
                left: `${iconObj.left}%`,
                animationDelay: `${iconObj.delay}s`,
                animationDuration: "8s",
              }}
            >
              <IconComponent className="w-6 h-6" />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className={`text-center max-w-5xl transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-4">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <Brain className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                <Sparkles className="w-6 h-6 text-pink-400 absolute -bottom-1 -left-1 animate-spin" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-cyan-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              Find Your Tribe.
              <br />
              <span className="text-5xl md:text-6xl">Powered by AI.</span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed max-w-4xl mx-auto">
              Stop scrolling through endless profiles. Our AI learns your vibe
              and connects you with people who share your interests, values, and
              energy. Real friendships, intelligently matched.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-full px-6 py-3 backdrop-blur-sm transition-all duration-500 ${
                      activeFeature === index
                        ? "bg-gradient-to-r from-purple-600/80 to-cyan-600/80 scale-110 shadow-lg"
                        : "bg-purple-800/50 hover:bg-purple-700/60"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-cyan-400" />
                    <span className="text-purple-100 font-medium">
                      {feature.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mb-16">
            <SignedOut>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <SignInButton>
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-purple-400/20">
                    <Zap className="w-5 h-5 mr-2" />
                    Join the Network
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    variant="outline"
                    className="border-2 border-cyan-400 text-cyan-200 hover:bg-cyan-800/30 px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/feed">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-12 py-6 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-purple-400/20">
                  <Users className="w-6 h-6 mr-3" />
                  Discover Friends
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 rounded-3xl p-8 mb-12 backdrop-blur-sm border border-purple-500/20 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  10M+
                </div>
                <div className="text-purple-300 font-medium">Active Users</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  2.4M
                </div>
                <div className="text-purple-300 font-medium">
                  Friendships Made
                </div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  95%
                </div>
                <div className="text-purple-300 font-medium">
                  Match Accuracy
                </div>
              </div>
            </div>
          </div>

          {/* Features Showcase */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-purple-800/40 to-blue-800/40 rounded-2xl p-6 backdrop-blur-sm border transition-all duration-500 hover:scale-105 ${
                    activeFeature === index
                      ? "border-cyan-400/60 shadow-xl shadow-cyan-500/20"
                      : "border-purple-500/20 hover:border-purple-400/40"
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-full transition-all duration-500 ${
                        activeFeature === index
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500 scale-110"
                          : "bg-purple-700/50"
                      }`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-purple-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-purple-300 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Testimonial Section */}
          <div className="bg-gradient-to-r from-purple-800/40 to-cyan-800/40 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/20 shadow-2xl mb-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-current mx-1 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <div className="transition-all duration-500">
              <p className="text-xl text-purple-100 mb-4 italic font-medium">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-cyan-300 font-bold text-lg">
                — {testimonials[currentTestimonial].author}
              </p>
            </div>
          </div>

          {/* Interest Tags */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-purple-200 mb-6">
              Connect Through Shared Interests
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {interests.map((interest, index) => {
                const IconComponent = interest.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-700/50 to-blue-700/50 rounded-full px-4 py-2 backdrop-blur-sm border border-purple-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4 text-cyan-400" />
                    <span className="text-purple-200 text-sm font-medium">
                      {interest.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="text-purple-300 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
              <strong className="text-transparent bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text">
                Your next best friend is one click away.
              </strong>
              <br />
              Let our AI analyze your personality, interests, and social
              patterns to find people who truly get you. Plus, get smart
              suggestions to make your posts shine.
            </p>

            <div className="flex justify-center items-center gap-4 text-purple-300">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">Smart Matching</span>
              </div>
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span className="text-sm">Post Optimization</span>
              </div>
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Real Connections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
