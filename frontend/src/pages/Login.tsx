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

const Login = ({ onLogin }: { onLogin: (token: string, user: any) => void }) => {
  const [userId, setUserId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Import useNavigate for redirection

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, privateKey }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token, data.user);
        // ✅ Redirect based on user role
        if (data.user.userRole === "Admin") {
          navigate("/admin"); // Redirect to Admin Dashboard
        } else {
          navigate("/user"); // Redirect to User Dashboard
        }
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (error) {
      setError("Failed to connect to the server.");
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
                    type="username"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Private Key</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                    </a>
                  </div>
                  <Input value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)} id="password" type="password" required />
                </div>
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
  )
}

export default Login;