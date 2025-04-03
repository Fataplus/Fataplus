
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare, ThumbsUp, MessageCircle, Share2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  
  // Sample posts data
  const posts = [
    {
      id: 1,
      author: "Jean Baptiste",
      authorLocation: "Antananarivo",
      content: "Has anyone tried the new drought-resistant rice variety? How well does it perform in our region?",
      timeAgo: "2 hours ago",
      likes: 8,
      comments: 3,
      image: null,
    },
    {
      id: 2,
      author: "Marie Andriamahefa",
      authorLocation: "Antsirabe",
      content: "I'm selling freshly harvested avocados at the Antsirabe market this weekend. Come visit!",
      timeAgo: "5 hours ago",
      likes: 12,
      comments: 4,
      image: null,
    },
    {
      id: 3,
      author: "Rakoto Andrianarisoa",
      authorLocation: "Toamasina",
      content: "My tomato plants have these yellow spots. Can anyone help identify what's causing this and how to treat it?",
      timeAgo: "1 day ago",
      likes: 5,
      comments: 7,
      image: "/placeholder.svg",
    },
    {
      id: 4,
      author: "Fara Rasoamiaramanana",
      authorLocation: "Fianarantsoa",
      content: "Just finished installing the new irrigation system! It's already saving us time and water.",
      timeAgo: "2 days ago",
      likes: 24,
      comments: 6,
      image: "/placeholder.svg",
    },
  ];

  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.authorLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostSubmit = () => {
    // In a real app, this would submit the post to an API
    alert("Post submitted: " + newPostContent);
    setNewPostContent("");
  };

  return (
    <MainLayout>
      <div className="fataplus-container py-6">
        <h1 className="text-2xl font-bold mb-4">Community</h1>
        
        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* New post form */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Textarea
              placeholder="Share something with the community..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="mb-3 min-h-24"
            />
            <div className="flex justify-between">
              <Button variant="outline" size="sm">Add Photo</Button>
              <Button 
                size="sm" 
                onClick={handlePostSubmit}
                disabled={!newPostContent.trim()}
              >
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Posts tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="market">Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-muted h-10 w-10 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">{post.author}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{post.authorLocation}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mb-3">{post.content}</p>
                      {post.image && (
                        <div className="mb-3 bg-muted rounded-md h-40 w-full flex items-center justify-center">
                          <img src={post.image} alt="Post content" className="h-full w-full object-cover rounded-md" />
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <button className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments} comments</span>
                        </button>
                        <button className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">No posts found</p>
                  <p className="text-sm text-muted-foreground">Try a different search term</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="questions">
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">Community Questions</p>
                <p className="text-sm text-muted-foreground mb-4">Ask and answer farming questions</p>
                <Button>Ask a Question</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="market">
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">Community Marketplace</p>
                <p className="text-sm text-muted-foreground mb-4">Buy and sell directly with other farmers</p>
                <Button>Create Listing</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Assistant */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Fata AI Helper</p>
                <p className="text-sm text-muted-foreground">Get farming advice and answers</p>
              </div>
              <Button size="sm">Ask</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
