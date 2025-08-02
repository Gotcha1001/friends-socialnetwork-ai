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
  Heart,
  Sparkles,
  HomeIcon,
  Star,
  ArrowRight,
  User,
} from "lucide-react";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);

  const testimonials = [
    {
      text: "Adopting Mia brought joy and purpose to our family. She's our blessing.",
      author: "Sarah M.",
    },
    {
      text: "Giving a child a home changed our lives in ways we never imagined.",
      author: "David L.",
    },
    {
      text: "Every child deserves a loving family and a chance to thrive.",
      author: "Emma R.",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    const heartInterval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
      };
      setFloatingHearts((prev) => [...prev.slice(-5), newHeart]);
    }, 3000);
    return () => {
      clearInterval(testimonialInterval);
      clearInterval(heartInterval);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden pt-5">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-0 text-pink-400 opacity-60 animate-bounce"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: "6s",
            }}
          >
            <Heart className="w-6 h-6" />
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className={`text-center max-w-4xl transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <User className="w-16 h-16 text-blue-300 animate-pulse" />
                <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-pink-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Give a Child a Home.
              <br />
              <span className="text-5xl md:text-6xl">Build a Family.</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Around the world, countless children wait in orphanages, hoping
              for a loving family. Each profile tells a story of resilience,
              hope, and the dream of a forever home.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-blue-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-blue-200">Unconditional Love</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <HomeIcon className="w-5 h-5 text-blue-400" />
                <span className="text-blue-200">Forever Families</span>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <SignedOut>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <SignInButton>
                  <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button
                    variant="outline"
                    className="border-blue-400 text-blue-200 hover:bg-blue-800/50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/feed">
                <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white px-12 py-6 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <Heart className="w-6 h-6 mr-3" />
                  Meet a Child
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </SignedIn>
          </div>

          <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 rounded-2xl p-8 mb-12 backdrop-blur-sm border border-blue-500/20">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200 mb-2">
                  153M
                </div>
                <div className="text-blue-300">Orphans worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-200 mb-2">
                  2.7M
                </div>
                <div className="text-blue-300">Children in orphanages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-200 mb-2">∞</div>
                <div className="text-blue-300">Love you'll share</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-800/40 to-pink-800/40 rounded-2xl p-6 backdrop-blur-sm border border-blue-500/20">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <div className="transition-all duration-500">
              <p className="text-lg text-blue-200 mb-3 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-blue-300 font-semibold">
                — {testimonials[currentTestimonial].author}
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-blue-300 text-lg leading-relaxed max-w-2xl mx-auto">
              <strong className="text-blue-200">
                Choose love over loneliness.
              </strong>
              <br />
              When you adopt a child, you're not just building a family—you're
              giving a child hope, security, and a brighter future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
