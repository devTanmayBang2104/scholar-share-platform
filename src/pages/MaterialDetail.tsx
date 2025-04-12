
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { materialsService } from '@/services/api';
import { Material } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle,
  Eye, 
  Calendar,
  User,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await materialsService.getById(id);
        setMaterial(response as Material);
      } catch (err: any) {
        setError('Failed to load material details. Please try again later.');
        console.error('Error fetching material:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterial();
  }, [id]);

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!material || !isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }

    // Check if user has already voted
    const hasUserVoted = user ? material.voted.includes(user._id) : false;
    if (hasUserVoted) {
      toast.error('You have already voted on this material');
      return;
    }

    try {
      setIsVoting(true);
      const response = await materialsService.vote(material._id, voteType);
      
      // Update local state
      setMaterial(prev => {
        if (!prev) return null;
        return {
          ...prev,
          upvotes: voteType === 'upvote' ? prev.upvotes + 1 : prev.upvotes,
          downvotes: voteType === 'downvote' ? prev.downvotes + 1 : prev.downvotes,
          voted: [...prev.voted, user?._id || ''],
        } as Material;
      });
      
      toast.success(`Successfully ${voteType === 'upvote' ? 'upvoted' : 'downvoted'} the material`);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleReport = async () => {
    if (!material || !isAuthenticated) {
      toast.error('Please log in to report content');
      return;
    }

    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    try {
      setIsReporting(true);
      await materialsService.report(material._id, reportReason);
      setReportDialogOpen(false);
      setReportReason('');
      toast.success('Report submitted successfully');
    } catch (error) {
      console.error('Error reporting:', error);
    } finally {
      setIsReporting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-scholar-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !material) {
    return (
      <Layout>
        <div className="bg-red-50 text-red-700 p-6 rounded-md max-w-3xl mx-auto">
          <p className="font-medium">{error || 'Material not found'}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/materials">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Materials
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Format upload date
  const uploadDate = new Date(material.createdAt);
  const timeAgo = formatDistanceToNow(uploadDate, { addSuffix: true });
  
  // Get uploader name
  const uploaderName = typeof material.uploadedBy === 'string' 
    ? 'Unknown User' 
    : (material.uploadedBy?.name || 'Unknown User');
  
  // Check if user has already voted
  const hasUserVoted = user ? material.voted.includes(user._id) : false;

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/materials">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Materials
          </Link>
        </Button>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{material.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-scholar-secondary/20 text-scholar-secondary">
                {material.category}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                {material.year}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Calendar className="h-4 w-4" />
              <span>{timeAgo}</span>
              <span className="mx-1">•</span>
              <User className="h-4 w-4" />
              <span>{uploaderName}</span>
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700">{material.description}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleVote('upvote')}
                  disabled={isVoting || hasUserVoted || !isAuthenticated}
                  className={hasUserVoted ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Upvote ({material.upvotes || 0})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleVote('downvote')}
                  disabled={isVoting || hasUserVoted || !isAuthenticated}
                  className={hasUserVoted ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Downvote ({material.downvotes || 0})
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Material</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for reporting</Label>
                        <Textarea
                          id="reason"
                          placeholder="Please explain why you're reporting this content..."
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button 
                        onClick={handleReport} 
                        disabled={isReporting || !reportReason.trim()}
                        className="w-full"
                      >
                        {isReporting ? 'Submitting...' : 'Submit Report'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button asChild>
                  <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    View PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h3 className="font-semibold mb-4">PDF Preview</h3>
            <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-md border border-gray-200 overflow-hidden">
              <iframe 
                src={material.fileUrl} 
                className="w-full h-[500px]" 
                title={`PDF preview of ${material.title}`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MaterialDetail;
