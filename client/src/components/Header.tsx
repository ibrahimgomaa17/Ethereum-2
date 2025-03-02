import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

interface HeaderProps {
    token: string | null;
    user: any;
    onLogout: () => void;
}

const Header = ({ token, user, onLogout }: HeaderProps) => {
    return (
        <AppBar position="static" sx={{ bgcolor: "background.paper", boxShadow: 3 }}>
            <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
                {/* Logo/Brand */}
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "grey.700",
                        fontWeight: 600,
                        "&:hover": { color: "blue.300" },
                    }}
                >
                    Blockchain Registry
                </Typography>

                {/* Navigation Links */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {token ? (
                        <>
                            <Typography variant="body1" sx={{ color: "grey.300" }}>
                                Welcome, <span style={{ fontWeight: 600 }}>{user?.userId}</span>
                            </Typography>
                            <Button
                                onClick={onLogout}
                                variant="contained"
                                sx={{
                                    bgcolor: "red.500",
                                    "&:hover": { bgcolor: "red.600" },
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button component={RouterLink} to="/login" color="primary"
                            fullWidth
                            variant="plain"
                        >
                            Login
                        </Button>


                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

import { LinkProps } from "react-router-dom";
import { Button } from "@mui/joy";

type CombinedProps = Omit<BoxProps, 'color' | 'onAbort'> & Omit<LinkProps, 'color' | 'onAbort'>;

interface CustomIconProps extends CombinedProps {
    color?: BoxProps['color'] | LinkProps['color'];
}

export function CustomIcon({ sx, ...props }: CustomIconProps) {
    return (
        <Box
            {...props}
            sx={[
                {
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "999px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundImage:
                        "linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)",
                    color: "hsla(210, 100%, 95%, 0.9)",
                    border: "1px solid",
                    borderColor: "hsl(210, 100%, 55%)",
                    boxShadow: "inset 0 2px 5px rgba(255, 255, 255, 0.3)",
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <DashboardRoundedIcon color="inherit" sx={{ fontSize: "1rem" }} />
        </Box>
    );
}
