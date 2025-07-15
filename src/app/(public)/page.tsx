"use client";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Users, Play, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: <Play className="h-6 w-6" />,
  },
  {
    title: "Progress Tracking",
    description:
      "Track your progress and stay motivated with our detailed progress reports.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: "Community Support",
    description:
      "Connect with a community of learners and get help from our dedicated support team.",
    icon: <Users className="h-6 w-6" />,
  },
];

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Badge variant="outline">The Future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">
            Elevate your Learning Experience
          </h1>
          <p className="text-muted-foreground md:text-xl text-center max-w-2xl mx-auto">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Explore Courses
            </Link>
            {!session && !isPending && (
              <Link
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                })}
                href="/login"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-20">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
