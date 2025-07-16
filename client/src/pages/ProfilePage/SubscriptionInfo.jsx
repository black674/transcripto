import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UseAuth } from "@/lib/auth/AuthContext";
import { CreditCard } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { ErrorCard } from "@/components/shared/ErrorCard";

export default function SubscriptionInfo() {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getProfile } = UseAuth();

  const usagePercentage =
    (subscriptionData?.transcript_count / subscriptionData?.transcript_limit) *
    100;

  const fetchSubscriptionData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setSubscriptionData(data);
    } catch (error) {
      setError("Failed to fetch subscription data", error);
    } finally {
      setLoading(false);
    }
  }, [getProfile]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  if (loading) {
    return (
      <LoadingCard contentLines={4} footer={true} className="col-span-1" />
    );
  }

  if (error) {
    return (
      <ErrorCard
        message={error}
        retryAction={() => fetchSubscriptionData()}
        className="col-span-1"
      />
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <CardTitle>Subscription</CardTitle>
        </div>
        <CardDescription>Your current subscription and usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Plan</span>
            <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full first-letter:uppercase">
              {subscriptionData?.subscription_plan}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Usage</span>
              <span className="text-sm text-muted-foreground">
                {subscriptionData?.transcript_count} of{" "}
                {subscriptionData?.transcript_limit} transcriptions
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Quota Resets</span>
            <span className="text-sm text-muted-foreground">
              {subscriptionData?.reset_date
                ? new Date(subscriptionData.reset_date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )
                : "Not available"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/pricing")} className="w-full">
          Upgrade Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
