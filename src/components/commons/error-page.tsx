"use client"

import { useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";

export function ErrorPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleBack = () => {
        const path = location.state?.from || '/';
        navigate(path, { replace: true });
    };
    return (
        <div className="w-full h-full min-h-dvh max-h-dvh flex items-center justify-center p-8">
            <div className="text-center grid gap-4">
                <h1 className="text-4xl font-bold">404<br />Page Not Found</h1>
                <p className="text-lg">The page you are looking for does not exist.</p>
                <Button onClick={() => handleBack()}>Back to previous page</Button>
            </div>
        </div>
    );
}