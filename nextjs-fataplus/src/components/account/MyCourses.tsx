'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import { getPocketBase } from '@/integrations/pocketbase/client';

interface MyCoursesProps {
  userId: string;
}

export default function MyCourses({ userId }: MyCoursesProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const pb = getPocketBase();
        const records = await pb.collection('userCourses').getList(1, 50, {
          filter: `user = "${userId}"`,
          expand: 'course',
        });
        setCourses(records.items);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No courses yet</h3>
        <p className="mb-4 text-muted-foreground">
          Enroll in courses to start learning.
        </p>
        <Link href="/learn">
          <Button>
            Browse Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Your Courses ({courses.length})</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((userCourse) => {
          const course = userCourse.expand?.course;
          if (!course) return null;
          
          const progress = course.lessons > 0
            ? Math.round((userCourse.completedLessons / course.lessons) * 100)
            : 0;
            
          return (
            <Card key={userCourse.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.category}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="mt-4">
                      <Link href={`/learn/${course.id}`}>
                        <Button size="sm">
                          {progress === 0 ? 'Start Course' : 'Continue Learning'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
