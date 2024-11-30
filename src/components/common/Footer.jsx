import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Contact Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <img
                src="/logo-black-Photoroom.svg?height=40&width=40"
                alt="Skillfinity Logo"
                className="h-20 w-auto"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">skillfinity@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">+91 9998887777</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Malappuram, Kerala</span>
              </div>
            </div>
          </div>

          {/* Home Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Home</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Our Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Our Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Our FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* About Us Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-green-400">About Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Company
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Achievements
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-green-400 transition-colors">
                  Our Goals
                </a>
              </li>
            </ul>
          </div>

          {/* Social Profiles */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Social Profiles</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-white p-2 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="#" 
                className="bg-white p-2 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="#" 
                className="bg-white p-2 rounded-md hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-700" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-600 text-center sm:text-left">
          <p className="text-sm">&copy; 2024 Skillfinity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

