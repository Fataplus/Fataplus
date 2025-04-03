import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { pb } from "@/integrations/pocketbase/client";
import { Post } from "@/integrations/pocketbase/types";
import { MoreHorizontal, Plus, Search, Loader2, MessageSquare, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CommunityManagement = () => {
  const [posts, setPosts] = useState<(Post & { likesCount: number, commentsCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<(Post & { likesCount: number, commentsCount: number, comments?: any[] }) | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const records = await pb.collection("posts").getList(1, 50, {
        sort: "-created",
        expand: "author",
      });
      
      // Get likes and comments count for each post
      const postsWithCounts = await Promise.all(records.items.map(async (post) => {
        const likesCount = await pb.collection("likes").getList(1, 1, {
          filter: `post = "${post.id}"`,
          countOnly: true,
        });
        
        const commentsCount = await pb.collection("comments").getList(1, 1, {
          filter: `post = "${post.id}"`,
          countOnly: true,
        });
        
        return {
          ...post,
          likesCount: likesCount.totalItems,
          commentsCount: commentsCount.totalItems,
        };
      }));
      
      setPosts(postsWithCounts as unknown as (Post & { likesCount: number, commentsCount: number })[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = async (post: Post & { likesCount: number, commentsCount: number }) => {
    try {
      setSelectedPost(post);
      
      // Fetch comments for the post
      const commentsRecords = await pb.collection("comments").getList(1, 50, {
        filter: `post = "${post.id}"`,
        sort: "created",
        expand: "author",
      });
      
      setComments(commentsRecords.items);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Error fetching post details:", error);
      toast({
        title: "Error",
        description: "Failed to load post details",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await pb.collection("posts").delete(postId);

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await pb.collection("comments").delete(commentId);

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });

      // Refresh comments
      if (selectedPost) {
        const commentsRecords = await pb.collection("comments").getList(1, 50, {
          filter: `post = "${selectedPost.id}"`,
          sort: "created",
          expand: "author",
        });
        
        setComments(commentsRecords.items);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.expand?.author?.name && post.expand.author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.expand?.author?.email && post.expand.author.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPostTypeColor = (postType: string) => {
    switch (postType) {
      case "question":
        return "bg-blue-100 text-blue-800";
      case "marketplace":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout title="Community Management">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        {post.expand?.author ? (
                          <div className="font-medium">
                            {post.expand.author.name || post.expand.author.email}
                          </div>
                        ) : (
                          "Unknown"
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                      <TableCell>
                        <Badge className={getPostTypeColor(post.postType)}>
                          {post.postType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            <span>{post.likesCount}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            <span>{post.commentsCount}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(post.created)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewPost(post)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Post Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
            <DialogDescription>
              View post content and comments.
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">
                      {selectedPost.expand?.author
                        ? selectedPost.expand.author.name || selectedPost.expand.author.email
                        : "Unknown"}
                    </div>
                    <Badge className={getPostTypeColor(selectedPost.postType)}>
                      {selectedPost.postType}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(selectedPost.created)}
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    <span>{selectedPost.likesCount} likes</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    <span>{selectedPost.commentsCount} comments</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">Comments</h3>
                {comments.length === 0 ? (
                  <p className="text-muted-foreground">No comments on this post.</p>
                ) : (
                  <div className="space-y-2">
                    {comments.map((comment) => (
                      <div key={comment.id} className="rounded-md border p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <div className="font-medium">
                            {comment.expand?.author
                              ? comment.expand.author.name || comment.expand.author.email
                              : "Unknown"}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(comment.created)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <span className="sr-only">Delete</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CommunityManagement;
