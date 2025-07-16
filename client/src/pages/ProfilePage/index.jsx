import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, LogOut, UserCircle } from "lucide-react";
import { UseAuth } from "@/lib/auth/AuthContext";
import SubscriptionInfo from "./SubscriptionInfo";

const ProfilePage = () => {
  const { user, logout } = UseAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userData = {
    email: user?.user?.email,
    createdAt: user?.user?.created_at
      ? new Date(user.user.created_at).toLocaleDateString("en-US", {
          weekday: "short",
          month: "long",
          day: "2-digit",
          year: "numeric",
        })
      : "",
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      navigate("/");
    }, 1000);
  };

  return (
    <div className="container min-h-screen !max-w-5xl py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubscriptionInfo />

          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserCircle className="h-5 w-5 text-primary" />
                <CardTitle>Account Details</CardTitle>
              </div>
              <CardDescription>
                Your personal account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Email</span>
                  <span className="text-sm text-muted-foreground">
                    {userData.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm text-muted-foreground">
                    {userData.createdAt}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <CardTitle>Activity</CardTitle>
              </div>
              <CardDescription>Recent activity on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 rounded-md border border-border p-4">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Account Created
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userData.createdAt}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
