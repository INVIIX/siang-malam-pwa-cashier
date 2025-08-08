import { Button } from "@/components/ui/button";
import { useAuth } from "../context/auth-context";

export default function ButtonLogout() {
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
    };
    return (
        <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
        </Button>
    );
}