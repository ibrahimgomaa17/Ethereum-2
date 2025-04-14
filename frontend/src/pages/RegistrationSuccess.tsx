import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopyIcon, CheckIcon, AlertTriangleIcon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

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
    toast.success(`${label} copied to clipboard`, {
      icon: <CheckIcon className="h-4 w-4 text-green-500" />,
    });
  };

  const downloadCredentials = () => {
    const data = `Blockchain Wallet Credentials\n\n` +
                 `User ID: ${userInfo.userId}\n` +
                 `Wallet Address: ${userInfo.walletAddress}\n` +
                 `Private Key: ${userInfo.privateKey}\n\n` +
                 `IMPORTANT: Keep this information secure!`;
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blockchain-wallet-${userInfo.userId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen   flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl border-0 shadow-xl rounded-xl overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 w-full"></div>
        
        <CardHeader className="text-center pb-4 px-8 pt-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Wallet Creation Complete!</CardTitle>
          <CardDescription className="text-lg text-gray-500 mt-2">
            Your blockchain identity has been successfully generated
          </CardDescription>
          <Badge variant="outline" className="mt-4 bg-green-50 text-green-600 border-green-200 text-sm py-1.5 px-4 mx-auto">
            Ready for Transactions
          </Badge>
        </CardHeader>

        <CardContent className="pt-2 px-8 pb-8 space-y-8">
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - User info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  User Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">User ID</Label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-mono text-sm break-all">{userInfo.userId}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(userInfo.userId, 'User ID')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ClipboardCopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Wallet Address</Label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-mono text-sm break-all">{userInfo.walletAddress}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(userInfo.walletAddress, 'Wallet address')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ClipboardCopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-purple-100 text-purple-800 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  Security Recommendations
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Store your private key in a password manager
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Write it down and keep in a secure location
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Never share your private key with anyone
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Consider using a hardware wallet for added security
                  </li>
                </ul>
              </div>
            </div>

            {/* Right column - Private key */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="rounded-lg bg-red-50 border border-red-200 p-5 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangleIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-medium text-red-800">Critical Security Information</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Your private key is the <strong className="font-semibold">only way to access your funds</strong>. 
                          If lost, <strong className="font-semibold">it cannot be recovered</strong> by anyone, including our support team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Private Key</Label>
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <span className="font-mono text-sm break-all">{userInfo.privateKey}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(userInfo.privateKey, 'Private key')}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      <ClipboardCopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    This is your only chance to save this private key. It will not be shown again.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={downloadCredentials}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download 
                  </Button>
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <Link to="/login">Continue to Dashboard</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">1</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Secure your private key</p>
                      <p className="text-sm text-gray-500">Store it in multiple secure locations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">2</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Fund your wallet</p>
                      <p className="text-sm text-gray-500">Transfer assets to your new wallet address</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">3</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Explore the platform</p>
                      <p className="text-sm text-gray-500">Start managing your blockchain assets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Label component if not already imported
const Label = ({ className, ...props }: any) => {
  return <label className={`block text-sm font-medium ${className}`} {...props} />;
};

export default RegistrationSuccess;