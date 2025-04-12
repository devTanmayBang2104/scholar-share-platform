
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trophy } from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';
import { Badge } from '@/components/ui/badge';

const ProfileInfo = () => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Badge levels based on points
  const determineBadge = (points: number) => {
    if (points >= 100) return { label: 'Scholar', icon: '🎓', color: 'badge-accent' };
    if (points >= 50) return { label: 'Expert', icon: '⭐', color: 'badge-primary' };
    if (points >= 20) return { label: 'Contributor', icon: '📚', color: 'badge-secondary' };
    return { label: 'Newcomer', icon: '🌱', color: 'badge-outline' };
  };

  const badge = determineBadge(user.points || 0);

  return (
    <>
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 self-center md:self-auto"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <div className={`badge ${badge.color} flex items-center gap-1`}>
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
                <div className="badge flex items-center gap-1 bg-purple-100 text-purple-600">
                  <Trophy className="h-3 w-3" />
                  <span>{user.points || 0} points</span>
                </div>
              </div>

              {user.bio && (
                <div className="mt-3 text-gray-600">
                  <p>{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
};

export default ProfileInfo;
