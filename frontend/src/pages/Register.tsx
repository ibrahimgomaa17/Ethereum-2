import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/services/auth';
import { Label } from '@radix-ui/react-label';
import { GalleryVerticalEnd } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import RegistrationSuccess from './RegistrationSuccess';

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

  const handleRegister = async () => {
    setError(null);
    if (!userId.trim()) {
      setError('User ID is required');
      return;
    }

    try {
      const response = await registerUser(userId);
      if ('error' in response) {
        throw new Error(response.error);
      }
      setRegisteredUser(response);
      toast('User registered successfully!');
    } catch (err: any) {
      toast(err.message);
    }
  };

  if (registeredUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RegistrationSuccess userInfo={registeredUser} />
        <Button asChild className="mt-6">
          <Link to="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6 min-h-screen justify-center pb-40')}>
      <a href="#" className="flex items-center justify-center gap-2 font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme Inc.
      </a>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome onboard</CardTitle>
          <CardDescription>Create your account, first choose a unique Id</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="userid">Username</Label>
                <Input
                  id="userid"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <Button onClick={handleRegister} className="w-full">
                Register
              </Button>
            </div>
            <div className="text-center text-sm">
              Do you have an account?{' '}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default RegistrationForm;
