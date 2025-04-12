
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Upload, FileText, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="text-scholar-primary" />
          <span className="font-serif text-xl font-bold text-scholar-primary">
            ScholarShare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-scholar-primary transition-colors">
            Home
          </Link>
          <Link to="/materials" className="text-gray-700 hover:text-scholar-primary transition-colors">
            Materials
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-scholar-primary transition-colors">
            About
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer w-full">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-materials" className="flex items-center gap-2 cursor-pointer w-full">
                      <FileText className="h-4 w-4" />
                      <span>My Materials</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 right-0 z-50 py-4 px-6 border-b border-gray-200 shadow-md flex flex-col gap-4 animate-fade-in">
          <Link 
            to="/" 
            className="block py-2 text-gray-700 hover:text-scholar-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/materials" 
            className="block py-2 text-gray-700 hover:text-scholar-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Materials
          </Link>
          <Link 
            to="/about" 
            className="block py-2 text-gray-700 hover:text-scholar-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/upload" 
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-scholar-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Upload className="h-4 w-4" />
                Upload Material
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-scholar-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link 
                to="/my-materials" 
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-scholar-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                My Materials
              </Link>
              <Button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                variant="ghost" 
                className="flex items-center justify-start gap-2 w-full py-2 text-gray-700 hover:text-scholar-primary hover:bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild variant="outline" className="justify-center w-full">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </Button>
              <Button asChild className="justify-center w-full">
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
