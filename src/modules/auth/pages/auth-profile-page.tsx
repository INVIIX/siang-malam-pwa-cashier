import { Button } from "@/components/ui/button";
import { EditProfileForm } from "../components/ui/edit-profile-form";
import { LogOutIcon } from "lucide-react";
import { useAuth } from "../components/context/auth-context";

export default function AuthProfilePage() {
    const { logout } = useAuth();
    return <>
        <section className="size-full flex flex-col">
            <div className="h-auto flex justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Account</h2>
                    <p className="text-muted-foreground">
                        manage your account profile and password.
                    </p>
                </div>
                <div className="flex items-center">
                    <Button variant="destructive" onClick={() => logout()} className="w-full">
                        Logout <LogOutIcon />
                    </Button>
                </div>
            </div>
            <div className="flex-1">
                <div className="grid max-w-md mx-auto gap-4">
                    <div className=" border rounded p-4 shadow rounded-lg bg-white ">
                        <EditProfileForm />
                    </div>
                </div>
            </div>
        </section>
    </>;
}