import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Heart, 
  Sparkles, 
  Wallet, 
  Shield, 
  Coins,
  ChevronLeft,
  ChevronRight,
  Star,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const heroImages = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop&crop=face'
];

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description: 'Our advanced AI analyzes compatibility and suggests perfect matches based on your interests and values.'
  },
  {
    icon: Wallet,
    title: 'Wallet-Native Login',
    description: 'Connect securely with your Celo wallet. No passwords, no data breaches, just pure web3 authentication.'
  },
  {
    icon: Shield,
    title: 'Privacy-First Dating',
    description: 'Your data stays private. Our AI agent works locally to protect your personal information.'
  },
  {
    icon: Coins,
    title: 'Crypto Rewards & Tips',
    description: 'Send cUSD tips to matches, earn rewards for successful connections, and unlock premium features.'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    text: 'Found my perfect match through CeloSoul! The AI really understands compatibility.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    text: 'Love the wallet integration. Finally, a dating app that respects privacy and rewards users.',
    rating: 5
  },
  {
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    text: 'The AI matching is incredible. Every suggestion feels personalized and meaningful.',
    rating: 5
  }
];

export function LandingPage() {
  const { loginTestMode } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="w-16 h-16 text-yellow-400 fill-yellow-400" />
            <h1 className="text-6xl md:text-8xl font-bold">CeloSoul</h1>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Find Your Soulmate with AI-Powered Dating
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Wallet-native, private, and fun. Let AI help you connect.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg"
              onClick={() => scrollToSection('signup')}
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-8 py-4 text-lg"
              onClick={() => scrollToSection('features')}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose CeloSoul?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of dating with AI-powered matching and blockchain security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <feature.icon className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Love Stories from Our Users
            </h2>
            <p className="text-xl text-gray-600">
              Real connections, real results
            </p>
          </div>

          <div className="relative">
            <Card className="p-8 text-center">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full mx-auto mb-6 object-cover"
              />
              
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900">
                {testimonials[currentTestimonial].name}
              </h4>
            </Card>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-yellow-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA/Signup Section */}
      <section id="signup" className="py-20 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Find Your Soulmate?
          </h2>
          <p className="text-xl text-black/80 mb-8">
            Start connecting securely with your wallet
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <ConnectButton />
            </div>
            
            <div className="text-black/60">or</div>
            
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-black border-black/20 px-8 py-4"
              onClick={async () => {
                await loginTestMode('demo@celosoul.com');
                navigate('/app/discover');
              }}
            >
              Try Demo Mode
            </Button>
          </div>

          <p className="text-sm text-black/60 mt-6">
            Supports Valora, MetaMask, and all WalletConnect wallets
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold">CeloSoul</span>
              </div>
              <p className="text-gray-400 mb-6">
                The future of dating is here. Connect authentically with AI-powered matching and blockchain security.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Safety</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CeloSoul. All rights reserved. Built with ❤️ on Celo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}