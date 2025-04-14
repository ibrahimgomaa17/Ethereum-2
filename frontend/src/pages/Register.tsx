import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/services/auth';
import { Label } from '@radix-ui/react-label';
import { GalleryVerticalEnd, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import RegistrationSuccess from './RegistrationSuccess';
import { Badge } from '@/components/ui/badge';

interface UserRegistrationInfo {
  userId: string;
  walletAddress: string;
  privateKey: string;
}

const RegistrationForm = () => {
  const { registerUser } = useAuth();
  const [userId, setUserId] = useState('');
  const [registeredUser, setRegisteredUser] = useState<UserRegistrationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setIsLoading(true);
    
    if (!userId.trim()) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(userId);
      if ('error' in response) {
        throw new Error(response.error);
      }
      setRegisteredUser(response);
      toast.success('Account created successfully!', {
        description: 'Your blockchain wallet has been generated',
      });
    } catch (err: any) {
      toast.error('Registration failed', {
        description: err.message || 'Please try a different user ID',
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
        <div className="w-full">
          <RegistrationSuccess userInfo={registeredUser} />
          <Button 
            asChild 
            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
          >
            <Link to="/login" className="flex items-center justify-center">
              Go to Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-gradient-to-br  flex items-center justify-center p-4')}>
      <div className="w-full max-w-md space-y-8">
        {/* Brand Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg mb-4">
            <GalleryVerticalEnd className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join Blockchain Portal</h1>
          <Badge variant="outline" className="mt-2 bg-indigo-50 text-indigo-600 border-indigo-200">
            Secure Account Creation
          </Badge>
        </div>

        {/* Registration Card */}
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden pt-0 px-0 pb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 w-full"></div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-500">
              Get started with your blockchain journey
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="userid" className="text-sm font-medium text-gray-700">
                    Choose Your User ID
                  </Label>
                  <Input
                    id="userid"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="py-3 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter a unique identifier"
                  />
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="rounded-lg bg-purple-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800">Important</h3>
                      <div className="mt-2 text-sm text-purple-700">
                        <p>Your user ID will be permanently associated with your blockchain wallet.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.01]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span>Create Blockchain Wallet</span>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-purple-600 hover:text-purple-700 underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          By registering, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
            Privacy Policy
          </a>.
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;