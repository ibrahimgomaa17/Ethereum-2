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
import { GalleryVerticalEnd } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/services/auth"

const Login = ({ onLogin }: { onLogin: (token: string, user: any) => void }) => {
  const [userId, setUserId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async () => {
    try {
      const data = await loginUser(userId, privateKey);
      onLogin(data.token, data.user);
      
      // Redirect based on user role
      navigate(data.user.userRole === "Admin" ? "/admin" : "/user");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 min-h-screen justify-center pb-40")}>
      <a href="#" className="flex items-center justify-center gap-2 font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme Inc.
      </a>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your username or private key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Private Key</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default Login;