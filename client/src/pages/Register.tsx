import { useState } from "react";
import { Box, Button, Input, Typography, Card, CardContent } from '@mui/joy';

const RegistrationForm = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("User registered successfully!");
      } else {
        setError(data.error || "Failed to register user");
      }
    } catch (error) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <Box className="flex items-center justify-center">
      <Card variant="outlined" sx={{ width: 400, padding: 3, marginBottom: '10rem' }}>
        <CardContent>
          <Typography level="h4" fontWeight="bold" textAlign="center" mb={2}>
            User Registration
          </Typography>

          {error && (
            <Typography color="danger" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" textAlign="center" mb={2}>
              {success}
            </Typography>
          )}

          <Box mb={2}>
            <Typography fontWeight="medium">
              User ID
            </Typography>
            <Input
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
            />
          </Box>

          <Button
            onClick={handleRegister}
            color="primary"
            variant="solid"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegistrationForm;
