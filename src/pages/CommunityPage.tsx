import React, MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare, ThumbsUp, MessageCircle, Share2, Plus, Loader2, ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRealtimeSubscription, RealtimeEvent } from "@/services/realtimeService";
import { pb } from "@/integrations/pocketbase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallbhc karIe } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import RealtimeIndicator from "@/components/realtime/RealtimeIndicator";
import { formatDistanceToNow } from "date-fns";

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [sut   e Smn}]leSea'ost',
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
        duration: 3000 or tab change
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
     
    return content.includes(query) || authorName.includes(query ) || authorLocation.includes(query);
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
  r Tbraue>All Posts</TabsTrigger>
    <Ma nLayo        ="CommTTiey">al">General</TabsTrigger>
      <  vLctsNam="carx-ao p-6">
<di clssNme="flex jusify-betweenitm-enr mb-4">
          <h1 classNam =" ext-2xl font-bold">Comm  ity</h1>   <div className="flex items-center justify-center h-40">
          <R al imvI>dca  r cl  sName="w-au o" /> ) : filteredPosts.length === 0 ? (
        </d v>me="text-center py-10">

        <  v casNtNamu="flextflex-edlgmd:rlex-u"woga -6"> found. Be the first to post!</p>
        < {/* Lif> sdba  */              {filteredPosts.map((post) => (
          <div cla sNam ="w-f ll  d:w-1/4 spac -y-4">iv className="flex items-start gap-2 mb-3">
         <ra<Card>{post.expand?.author?.avatar} alt={post.expand?.author?.name} />
              < ardC       /AaasName="p-4">
                <h3 c a sNam ="text-lg     -="mtboeiemb-2">Community</h3>and?.author?.name || 'Unknown User'}</h3>
                <p classNam ="text- m  ext-gray-500 mb-4">   <ecp sith farmNa=, shar" k-owsetge,5and ask qu   i  na</a>Unknown Location'} · 
                <Butto  classNam =" -full"  n lick={() => d cum   {gepElcmentByIdd"new-post" ??foomDiN}>new Date(post.created), { addSuffix: true }) : 'Unknown time'}
                  <Plus className="mr-2 h-4 w-4"  >        P         {/* Post type badge */}
                </B t  n>
              </Card      <>adge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            </Card>                       Question
                              </Badge>
            < ard>                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
              <CardCon  n   lassN m ="p-4">  Marketplace
               /<B3 clasdNam>="txt-lg fot-semiboldmb-2">Toc</3>
             < l className="sp ce-y-2">      )}
                  <li  las Nam ="t xt-sm h ve :text-p imayurso-po">Cp Man gemen </li>           <p className="mb-4">{post.content}</p>
                  <l  classN mo=".exr-sm h&ver:(x-prima curso -po   er">P  t Con  ol</l<> className="mb-4 rounded-md overflow-hidden">
                  <li clas Name="t x -s  hover: ex -primary cursor-po  ter">Irri  tion</ i>
                   l             text-sm hover:tex -prim ry crorpiter">Susabl Faming</li
                   l             t  mpsm hovcr:lsxt-prm"ary curhor-poiw-4r">Ma"ket Prices</li
                   li               <ssm hover:teat-primary>cursor-ppioseresEquip e}t</l<>
                paul
               /C rdCon   t>
            </Card>
          </ iv>

          {/* Ma n  onten  */}
          <divbutton>fllmd:w-34 space-y-4"
                       and f l ers    <span>{post.comments || 0}</span>
                            flex items-cente  gap-2">
              <div classNam ="re</buttoflex1
                                <button className2.5"flex2.5items-center g:tay-500primary">
                                  <Share2 className="h-4 w-4" />
                  ty e="search"
                  p               <span>Share</span>
                  className="pl-8"
                                </button>
                              </div>
                />ontent>
              < div         </Card>
                      ))}
                </TabsContent>
                  )}
                <
              </div>
        </di    v>
      </div>    id="new-ost"
                  p
    </MainLayo    className="mb-4 min-h-[100px]"
                  ut>
  );    
};    dibld{!user|| subttig}
    
export defau    lt CommunityPage;d
    
                    onClck={hdlePsSubmt}
                    dable={!newsCntent.trim() || !ser || submiig}
                        {sbmiig ? (      <>
                        <Loader2 clasNammr-2 h-4 w-4 animate-pin />        Pstg...
                      </>
                    ) : (
                      ''
                    )}
                  </Bton></v>
                {!user && (
                  <p clasNm"txt-x text-mued-foregrud mt-2 tex-ce">Youneedtobeloggedintopostinthecmmuniy.    p    )}            filer    onVaueChng{handleTaChange}    justfytart            place       <TabsTriggervalue="general">GeneralTrgger    /sLi
  oai  flex item-nter justifcenter h-0  <Load2 claNae="h-8 w-8 nimate-pin ext-primary"/spnclassNam"ml-2">Loading s..</span</div>
          ) : filteePss.lgh==0?(
tceney10ptextfoegr">No posts ond.B te frst to post!p/):(
      TabsContentvalue={ativeTab} cspacey-4 t-4
                  filteredPsmp((pst) => (
                    Card key={ost.id}<CardContentclassName="p-4">
                     satb3AvAvatarImage src={pot.exd?.author?.avatar} alt={pot.exand?.uthor?.ame} /AvatarFallbck.expand?auhor?.na?.chart(0) || '?'AvatarFallbckAatar  h3font-mediu.expand?authr?.am || 'Unknow User'h3      < className="text-x tex-gry-500">
   {post.expnd?.ho?.locati||'UnknonLoao'} ·    cretd ?formDianeToNw(ew Da(pos.retd), { addSuix:ru }) :'Unknw tim'}
   p    </div> {/* Potypbdge */}divmlauto  potTye==='question'&&(
Badge varian="utlie"bg-bu-50xtblu-700 hov:bblue-50      Squamr-1 33      Quei
                             Bdge    )}
                            {pos.pstType === 'marketplace' && (      Badge varian="utlie"bg-gren-50xtgre-700 hov:bgreen-50      oppingBgmr-1 33      Mktlce</Badge>
)}
iv    
p"mb-4>{os.ont}</p
                         {pos.iagUl &&(        divmb-4 rudedverlw-hidde"          img src={ost.imageUrl} alt="Post attachment"wfullha /
      iv 
ivflex items-center ga4sm tx-gay-500      <uflis-cenr gap1 hve:txt-piary
        Clic={()=>handlLkePs(pst.id)}        humUpcassNamh-4 w-4 /  sp>{pos.liks ||0}</p      </u          buttonlex iemscergp-1 hove:tx-rimry"            MessageCircleh4wsp>{pos.comms || 0}</span    uonbuttonflex tes-centegap-1 hv:text                  Sh2h w-4 /n>Shae<sa  </button>
/      /CrdCnt
  /C
))}  /TabsCtn
              )}Tabsiviv