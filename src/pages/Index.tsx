
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Search, Award, Shield } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Share Knowledge, <span className="text-scholar-primary">Excel Together</span>
            </h1>
            <p className="text-xl mb-8 text-gray-600 max-w-lg">
              A platform for students to share and access quality study materials, collaborate, and succeed in their academic journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-scholar-primary hover:bg-scholar-primary/90">
                <Link to="/materials">Explore Materials</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/upload">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Material
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img 
              src="/placeholder.svg" 
              alt="Students sharing study materials" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose ScholarShare?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-scholar-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Materials</h3>
              <p className="text-gray-600">
                Access a wide range of verified and high-quality study resources created by your peers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-scholar-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Sharing</h3>
              <p className="text-gray-600">
                Upload and share your notes, previous papers, and handbooks with other students in just a few clicks.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-scholar-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-gray-600">
                Find exactly what you need with powerful filtering and search capabilities across all materials.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recognition</h3>
              <p className="text-gray-600">
                Earn points and badges for your contributions and become a recognized contributor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 h-0.5 bg-gray-200 w-3/4" />
            
            <div className="text-center relative">
              <div className="h-12 w-12 bg-scholar-primary rounded-full flex items-center justify-center mb-6 mx-auto text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up with your email and set up your student profile to start using ScholarShare.
              </p>
            </div>
            
            <div className="text-center relative">
              <div className="h-12 w-12 bg-scholar-primary rounded-full flex items-center justify-center mb-6 mx-auto text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Materials</h3>
              <p className="text-gray-600">
                Share your study materials or browse through the existing collection to find what you need.
              </p>
            </div>
            
            <div className="text-center relative">
              <div className="h-12 w-12 bg-scholar-primary rounded-full flex items-center justify-center mb-6 mx-auto text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Together</h3>
              <p className="text-gray-600">
                Vote on helpful content, earn recognition, and help build a valuable resource for all students.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Safe Community Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="mb-4 inline-block">
                <Shield className="h-12 w-12 text-scholar-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Safe and Supportive Community</h2>
              <p className="text-gray-600 mb-6">
                We prioritize creating a safe space for knowledge sharing. Our reporting system and community guidelines ensure that all content is respectful, appropriate, and academically honest.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Content review process</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Report inappropriate materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Academic integrity guidelines</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/placeholder.svg" 
                alt="Community guidelines" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-scholar-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to enhance your learning journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already sharing and benefiting from quality study materials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-scholar-primary hover:bg-gray-100">
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link to="/materials">Browse Materials</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
