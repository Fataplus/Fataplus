import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { pb } from '@/integrations/pocketbase/client';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sprout, 
  ShoppingBag, 
  BookOpen, 
  Users, 
  Check 
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Define the onboarding steps based on user type
  const getUserSteps = (): OnboardingStep[] => {
    const commonSteps = [
      {
        title: 'Welcome to FataPlus!',
        description: 'Your all-in-one platform for agriculture in Madagascar. Let\'s get you started with a quick tour.',
        icon: <Sprout className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/welcome.jpg'
      }
    ];

    const farmerSteps = [
      {
        title: 'Learn Agricultural Techniques',
        description: 'Access courses and resources to improve your farming practices and increase yields.',
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/learn.jpg'
      },
      {
        title: 'Sell Your Products',
        description: 'List your agricultural products and reach customers directly through our marketplace.',
        icon: <ShoppingBag className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/sell.jpg'
      },
      {
        title: 'Connect with the Community',
        description: 'Ask questions, share knowledge, and connect with other farmers and agricultural experts.',
        icon: <Users className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/community.jpg'
      }
    ];

    const sellerSteps = [
      {
        title: 'Manage Your Products',
        description: 'List and manage your agricultural products to reach farmers across Madagascar.',
        icon: <ShoppingBag className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/products.jpg'
      },
      {
        title: 'Connect with Customers',
        description: 'Interact with potential customers and build your reputation in the marketplace.',
        icon: <Users className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/customers.jpg'
      }
    ];

    const learnerSteps = [
      {
        title: 'Explore Courses',
        description: 'Browse our extensive library of agricultural courses and start learning today.',
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/courses.jpg'
      },
      {
        title: 'Track Your Progress',
        description: 'Monitor your learning journey and earn certificates as you complete courses.',
        icon: <Check className="h-8 w-8 text-primary" />,
        image: '/assets/images/onboarding/progress.jpg'
      }
    ];

    const completionStep = [
      {
        title: 'You\'re All Set!',
        description: 'You\'re now ready to make the most of FataPlus. Explore the app and start your journey!',
        icon: <Check className="h-8 w-8 text-green-500" />,
        image: '/assets/images/onboarding/complete.jpg'
      }
    ];

    // Return steps based on user type
    if (user?.userType === 'farmer') {
      return [...commonSteps, ...farmerSteps, ...completionStep];
    } else if (user?.userType === 'seller') {
      return [...commonSteps, ...sellerSteps, ...completionStep];
    } else if (user?.userType === 'learner') {
      return [...commonSteps, ...learnerSteps, ...completionStep];
    } else {
      // Default steps for any other user type
      return [...commonSteps, ...completionStep];
    }
  };

  const steps = getUserSteps();

  useEffect(() => {
    // Check if user is logged in and hasn't completed onboarding
    if (user && user.id && !user.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    // Mark onboarding as completed
    if (user && user.id) {
      try {
        // Update user profile in PocketBase
        await pb.collection('users').update(user.id, {
          onboardingCompleted: true
        });

        // Update local user state
        updateUserProfile({
          ...user,
          onboardingCompleted: true
        });

        // Close onboarding
        setShowOnboarding(false);

        // Navigate based on user type
        if (user.userType === 'farmer') {
          navigate('/learn');
        } else if (user.userType === 'seller') {
          navigate('/shop');
        } else if (user.userType === 'learner') {
          navigate('/learn');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error updating onboarding status:', error);
      }
    }
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Step indicator */}
          <div className="mb-6 flex justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`mx-1 h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              {steps[currentStep].icon}
            </div>
            <h2 className="mb-2 text-xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {/* Step image */}
          {steps[currentStep].image && (
            <div className="mb-6 overflow-hidden rounded-md">
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>

          {/* Skip link */}
          {currentStep < steps.length - 1 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip onboarding
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;
