import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryVerticalEnd, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/services/auth"
import { Badge } from "@/components/ui/badge"

const Login = ({ onLogin }: { onLogin: (token: string, user: any) => void }) => {
  const [userId, setUserId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await loginUser(userId, privateKey);
      onLogin(data.token, data.user);
      navigate(data.user.userRole === "Admin" ? "/admin" : "/user");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br  flex items-center justify-center p-4")}>
      <div className="w-full max-w-md space-y-8">
        {/* Brand Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg mb-4">
            <GalleryVerticalEnd className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Blockchain Portal</h1>
          <Badge variant="outline" className="mt-2 bg-indigo-50 text-indigo-600 border-indigo-200">
            Secure Asset Management
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden pt-0 px-0 pb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 w-full"></div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-500">
              Sign in to your blockchain account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="py-3 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Private Key
                    </Label>
                    <Link to="/recovery" className="text-xs text-purple-600 hover:text-purple-700">
                      Forgot key?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="py-3 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your private key"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

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
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-purple-600 hover:text-purple-700 underline underline-offset-4"
              >
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
            Privacy Policy
          </a>.
        </div>
      </div>
    </div>
  );
};

export default Login;