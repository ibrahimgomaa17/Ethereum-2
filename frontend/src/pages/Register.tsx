import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerUser } from "@/services/auth";
import { Label } from "@radix-ui/react-label";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";


const RegistrationForm = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
debugger
    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    try {
      await registerUser(userId); // Use the service here
      setSuccess("User registered successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to register user");
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
            <CardTitle className="text-xl">Welcome onboard</CardTitle>
            <CardDescription>
              Create your account, first choose a unique Id
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-6">
                
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Do you have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
  );
};

export default RegistrationForm;
