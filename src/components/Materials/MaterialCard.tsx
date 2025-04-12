
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle,
  Eye,
  Calendar,
  User,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Material } from '@/types';
import { materialsService } from '@/services/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MaterialCardProps {
  material: Material;
  onVote: (materialId: string, newVoteCount: number) => void;
  onDelete?: (materialId: string) => Promise<void>;
}

const MaterialCard = ({ material, onVote, onDelete }: MaterialCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // Check if user has already voted
  const hasUserVoted = user ? material.voted.includes(user._id) : false;
  
  // Format upload date
  const uploadDate = new Date(material.createdAt);
  const timeAgo = formatDistanceToNow(uploadDate, { addSuffix: true });
  
  // Get uploader name (handle string ID or user object)
  let uploaderName = 'Unknown User';
  if (typeof material.uploadedBy === 'string') {
    uploaderName = 'Unknown User';
  } else if (material.uploadedBy && 'name' in material.uploadedBy) {
    uploaderName = material.uploadedBy.name;
  }

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!isAuthenticated) {
      toast.error('Please log in to vote');
      return;
    }

    if (hasUserVoted) {
      toast.error('You have already voted on this material');
      return;
    }

    try {
      setIsVoting(true);
      const response = await materialsService.vote(material._id, voteType);
      
      // Update local state via callback
      onVote(material._id, voteType === 'upvote' ? material.upvotes + 1 : material.upvotes);
      
      toast.success(`Successfully ${voteType === 'upvote' ? 'upvoted' : 'downvoted'} the material`);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) {
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

  const handleDeleteClick = async () => {
    if (onDelete) {
      try {
        await onDelete(material._id);
      } catch (error) {
        console.error('Error in delete handler:', error);
      }
    }
  };

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4">
        <div className="flex flex-col gap-1">
          <Link to={`/materials/${material._id}`} className="hover:text-scholar-primary transition-colors">
            <h3 className="font-semibold text-lg line-clamp-2">{material.title}</h3>
          </Link>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary" className="bg-scholar-secondary/20 text-scholar-secondary hover:bg-scholar-secondary/30">
              {material.category}
            </Badge>
            <Badge variant="outline" className="bg-gray-100">
              {material.year}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
            <span className="mx-1">•</span>
            <User className="h-3 w-3" />
            <span>{uploaderName}</span>
          </div>
        </div>
        <FileText className="h-10 w-10 text-scholar-primary/30" />
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-gray-600 text-sm line-clamp-3">{material.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-2 flex flex-wrap items-center justify-between gap-2 border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote('upvote')}
            disabled={isVoting || hasUserVoted || !isAuthenticated}
            className={hasUserVoted ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{material.upvotes || 0}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote('downvote')}
            disabled={isVoting || hasUserVoted || !isAuthenticated}
            className={hasUserVoted ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span>{material.downvotes || 0}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={handleDeleteClick}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
          
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <AlertCircle className="h-4 w-4 mr-1" />
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

          <Button variant="default" size="sm" asChild>
            <Link to={`/materials/${material._id}`} className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              View PDF
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;
