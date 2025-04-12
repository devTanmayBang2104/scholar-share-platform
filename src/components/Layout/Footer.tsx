
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 mb-6 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="text-scholar-primary" />
              <span className="font-serif text-xl font-bold text-scholar-primary">ScholarShare</span>
            </Link>
            <p className="text-gray-600 max-w-md">
              A platform for students to share and access study materials, collaborate, and excel in their academic journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-scholar-primary transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-scholar-primary transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-scholar-primary transition">
                <Instagram size={20} />
              </a>
              <a href="mailto:info@scholarshare.com" className="text-gray-500 hover:text-scholar-primary transition">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-scholar-primary transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/materials" className="text-gray-600 hover:text-scholar-primary transition">
                    Materials
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-scholar-primary transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-scholar-primary transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/materials?category=Previous Year Papers" className="text-gray-600 hover:text-scholar-primary transition">
                    Previous Year Papers
                  </Link>
                </li>
                <li>
                  <Link to="/materials?category=Handwritten Notes" className="text-gray-600 hover:text-scholar-primary transition">
                    Handwritten Notes
                  </Link>
                </li>
                <li>
                  <Link to="/materials?category=Books" className="text-gray-600 hover:text-scholar-primary transition">
                    Books
                  </Link>
                </li>
                <li>
                  <Link to="/materials?category=Handbooks" className="text-gray-600 hover:text-scholar-primary transition">
                    Handbooks
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
              <address className="not-italic text-gray-600">
                <p>Email: info@scholarshare.com</p>
                <p className="mt-2">Phone: +1 (555) 123-4567</p>
                <p className="mt-2">
                  ScholarShare Inc.<br />
                  123 Education Lane<br />
                  Learning City, ED 12345
                </p>
              </address>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} ScholarShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
