import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare, ThumbsUp, MessageCircle, Share2, Plus, Loader2, ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRealtimeSubscription, RealtimeEvent } from "@/services/realtimeService";
import { pb } from "@/integrations/pocketbase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import RealtimeIndicator from "@/components/realtime/RealtimeIndicator";
import { formatDistanceToNow } from "date-fns";

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Subscribe to realtime updates for posts
  const { isConnected } = useRealtimeSubscription({
    collection: 'posts',
    callback: (event: RealtimeEvent) => {
      if (event.action === 'create') {
        // Add new post to the list
        setPosts(prevPosts => [event.record, ...prevPosts]);
        toast({
          title: 'New post',
          description: 'Someone just posted in the community',
          duration: 3000
        });
      } else if (event.action === 'update') {
        // Update existing post
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === event.record.id ? event.record : post
          )
        );
      } else if (event.action === 'delete') {
        // Remove deleted post
        setPosts(prevPosts =>
          prevPosts.filter(post => post.id !== event.record.id)
        );
      }
    }
  });

  // Fetch posts on component mount or tab change
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        let filter = '';
        if (activeTab === 'questions') {
          filter = 'postType="question"';
        } else if (activeTab === 'marketplace') {
          filter = 'postType="marketplace"';
        } else if (activeTab === 'general') {
          filter = 'postType="general"';
        }

        const response = await pb.collection('posts').getList(1, 50, {
          sort: '-created',
          filter,
          expand: 'author'
        });

        setPosts(response.items);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load community posts',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, toast]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to post in the community',
        variant: 'destructive'
      });
      return;
    }

    if (!newPostContent.trim()) {
      toast({
        title: 'Empty post',
        description: 'Please enter some content for your post',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);

      // Determine post type based on content
      let postType = 'general';
      if (newPostContent.includes('?')) {
        postType = 'question';
      } else if (newPostContent.toLowerCase().includes('sell') ||
                newPostContent.toLowerCase().includes('buy') ||
                newPostContent.toLowerCase().includes('price') ||
                newPostContent.toLowerCase().includes('market')) {
        postType = 'marketplace';
      }

      // Create post
      await pb.collection('posts').create({
        author: user.id,
        content: newPostContent,
        postType
      });

      // Clear input
      setNewPostContent('');

      toast({
        title: 'Post created',
        description: 'Your post has been published to the community',
        duration: 3000
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle like post
  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to like posts',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Check if user already liked the post
      const existingLikes = await pb.collection('likes').getList(1, 1, {
        filter: `post="${postId}" && user="${user.id}"`
      });

      if (existingLikes.items.length > 0) {
        // User already liked the post, remove the like
        await pb.collection('likes').delete(existingLikes.items[0].id);

        toast({
          title: 'Like removed',
          description: 'You have removed your like from this post',
          duration: 2000
        });
      } else {
        // User hasn't liked the post yet, add a like
        await pb.collection('likes').create({
          post: postId,
          user: user.id
        });

        toast({
          title: 'Post liked',
          description: 'You have liked this post',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    const content = post.content?.toLowerCase() || '';
    const authorName = post.expand?.author?.name?.toLowerCase() || '';
    const authorLocation = post.expand?.author?.location?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return content.includes(query) || authorName.includes(query) || authorLocation.includes(query);
  });

  return (
    <MainLayout title="Community">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Community</h1>
          <RealtimeIndicator className="w-auto" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-1/4 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-sm text-gray-500 mb-4">Connect with farmers, share knowledge, and ask questions.</p>
                <Button className="w-full" onClick={() => document.getElementById("new-post")?.focus()}>
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Topics</h3>
                <ul className="space-y-2">
                  <li className="text-sm hover:text-primary cursor-pointer">Crop Management</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Pest Control</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Irrigation</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Sustainable Farming</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Market Prices</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Equipment</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4 space-y-4">
            {/* Search and filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* New post */}
            <Card>
              <CardContent className="p-4">
                <Textarea
                  id="new-post"
                  placeholder="Share something with the community..."
                  className="mb-4 min-h-[100px]"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  disabled={!user || submitting}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handlePostSubmit}
                    disabled={!newPostContent.trim() || !user || submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </Button>
                </div>
                {!user && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    You need to be logged in to post in the community.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Post filters */}
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading posts...</span>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No posts found. Be the first to post!</p>
                </div>
              ) : (
                <TabsContent value={activeTab} className="space-y-4 mt-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <Avatar>
                            <AvatarImage src={post.expand?.author?.avatar} alt={post.expand?.author?.name} />
                            <AvatarFallback>{post.expand?.author?.name?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{post.expand?.author?.name || 'Unknown User'}</h3>
                            <p className="text-xs text-gray-500">
                              {post.expand?.author?.location || 'Unknown Location'} ·
                              {post.created ? formatDistanceToNow(new Date(post.created), { addSuffix: true }) : 'Unknown time'}
                            </p>
                          </div>

                          {/* Post type badge */}
                          <div className="ml-auto">
                            {post.postType === 'question' && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                <MessageSquare className="mr-1 h-3 w-3" />
                                Question
                              </Badge>
                            )}
                            {post.postType === 'marketplace' && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                <ShoppingBag className="mr-1 h-3 w-3" />
                                Marketplace
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="mb-4">{post.content}</p>

                        {post.imageUrl && (
                          <div className="mb-4 rounded-md overflow-hidden">
                            <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto" />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <button
                            className="flex items-center gap-1 hover:text-primary"
                            onClick={() => handleLikePost(post.id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes || 0}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments || 0}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
