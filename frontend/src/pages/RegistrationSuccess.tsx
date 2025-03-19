import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface UserRegistrationInfo {
  userId: string;
  walletAddress: string;
  privateKey: string;
}

interface RegistrationSuccessProps {
  userInfo: UserRegistrationInfo;
}

const RegistrationSuccess = ({ userInfo }: RegistrationSuccessProps) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard.`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-xl">🎉 Registration Successful!</CardTitle>
          <CardDescription>
            User registered successfully. Please save this wallet information carefully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>User ID:</strong>
            <div className="flex items-center gap-2">
              {userInfo.userId}
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(userInfo.userId, 'User ID')}>
                <ClipboardCopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <strong>Wallet Address:</strong>
            <div className="flex items-center gap-2">
              {userInfo.walletAddress}
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(userInfo.walletAddress, 'Wallet address')}>
                <ClipboardCopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="bg-yellow-100 border border-yellow-400 rounded-md p-3">
            <strong className="text-yellow-800">⚠️ Important!</strong>
            <p className="text-yellow-700 text-sm">
              Your private key is shown below. <strong>Store it securely now!</strong> It will <strong>not be shown again</strong>, and <strong>cannot be reset or recovered if lost.</strong>
            </p>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded-md p-3 flex items-center justify-between">
            <span className="font-mono break-all">{userInfo.privateKey}</span>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(userInfo.privateKey, 'Private key')}>
              <ClipboardCopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mt-6">
            <Button asChild>
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationSuccess;
