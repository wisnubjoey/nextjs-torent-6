'use client';

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg border border-zinc-200 max-w-md">
        <h2 className="text-lg font-medium mb-4">Account</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Sign out of your account on this device.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
