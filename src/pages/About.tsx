
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Users, Award, Shield, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About ScholarShare</h1>
          <p className="text-xl text-gray-600">
            ScholarShare is a platform built by students, for students, to facilitate knowledge sharing and academic success through collaborative study material exchange.
          </p>
        </section>

        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To create an accessible, community-driven platform where students can share and discover quality study materials, fostering a culture of collaboration and academic excellence.
              </p>
              <p className="text-lg text-gray-600">
                We believe that knowledge should be accessible to all students, regardless of their background or resources. By connecting students and enabling them to share their notes, previous exam papers, and study guides, we aim to help everyone achieve their academic goals.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-scholar-primary rounded-full p-3 text-white">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Knowledge Sharing</h3>
                    <p className="text-gray-600">Facilitating the exchange of academic resources between students</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-scholar-secondary rounded-full p-3 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Community Building</h3>
                    <p className="text-gray-600">Creating connections between students across different years</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-scholar-accent rounded-full p-3 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Academic Excellence</h3>
                    <p className="text-gray-600">Supporting student success through quality resources</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-gray-50 py-16 px-6 rounded-xl">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="h-12 w-12 mx-auto text-scholar-primary mb-4" />
            <h2 className="text-3xl font-bold mb-6">How ScholarShare Works</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-scholar-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold text-xl mb-3">Upload Materials</h3>
                <p className="text-gray-600">
                  Students share their notes, previous year papers, books, and other valuable study resources.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-scholar-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold text-xl mb-3">Discover & Learn</h3>
                <p className="text-gray-600">
                  Find relevant materials through categories, filters, and search features to aid your learning.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-scholar-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold text-xl mb-3">Vote & Contribute</h3>
                <p className="text-gray-600">
                  Upvote helpful materials, earn recognition, and help build valuable resources for all.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/placeholder.svg" 
                alt="Content moderation" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-scholar-primary" />
                <h2 className="text-3xl font-bold">Content Moderation</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                We're committed to maintaining a platform with high-quality, appropriate study materials. Our content moderation process ensures that:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">All uploaded materials respect intellectual property rights and academic integrity</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Community members can report inappropriate content for review</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Our team reviews reports promptly and takes appropriate action</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Verified and high-quality materials receive recognition through our voting system</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-scholar-primary text-white py-16 px-6 rounded-xl text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl mb-8">
              Join thousands of students who are already sharing and accessing quality study materials.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-scholar-primary hover:bg-gray-100">
                <Link to="/register">Create an Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                <Link to="/materials">Browse Materials</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
