
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, MessageSquare, Clock, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCourses, getUserCourseProgress } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type Course = Database['public']['Tables']['courses']['Row'];
type UserCourse = Database['public']['Tables']['user_courses']['Row'] & {
  courses: Course;
};

const LearnPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data);

        // If user is logged in, fetch their course progress
        if (user) {
          const userProgress = await getUserCourseProgress(user.id);
          const progressMap: Record<string, number> = {};

          userProgress.forEach((item: UserCourse) => {
            progressMap[item.course_id] = item.completed_lessons;
          });

          setUserCourses(progressMap);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch courses'));
        toast({
          title: 'Error',
          description: 'Failed to fetch courses. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast, user]);

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="fataplus-container py-6">
        <h1 className="text-2xl font-bold mb-4">Learn</h1>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* AI Assistant */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Ask Fata AI</p>
                <p className="text-sm text-muted-foreground">Get answers to your agriculture questions</p>
              </div>
              <Button size="sm">Ask</Button>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <h2 className="text-lg font-semibold mb-3">Continue Learning</h2>
        {courses.some(course => course.completed > 0) ? (
          <div className="space-y-4 mb-6">
            {courses
              .filter(course => course.completed > 0)
              .map(course => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="bg-muted rounded-md h-16 w-16 flex-shrink-0 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{course.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {course.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {course.completed}/{course.lessons} completed
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-2">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${(course.completed / course.lessons) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">No courses in progress</p>
              <p className="text-sm text-muted-foreground mb-4">Start a course to see it here</p>
              <Button>Browse Courses</Button>
            </CardContent>
          </Card>
        )}

        {/* All Courses */}
        <h2 className="text-lg font-semibold mb-3">All Courses</h2>
        {filteredCourses.length > 0 ? (
          <div className="grid gap-4">
            {filteredCourses.map(course => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="bg-muted rounded-md h-16 w-16 flex-shrink-0 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium line-clamp-1">{course.title}</h3>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{course.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {course.lessons} lessons
                        </span>
                        {course.completed > 0 && (
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {course.completed}/{course.lessons} completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">No courses found</p>
              <p className="text-sm text-muted-foreground">Try a different search term</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default LearnPage;
