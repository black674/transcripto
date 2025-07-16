import { useModal } from "@/lib/modalContext/ModalContext";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UseAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SingleTier = ({
  loading,
  name = "Free",
  price = "$0",
  description = "Basic features for personal use",
  features = [],
  buttonText = "Get Started",
  popular = false,
  userSubscription,
}) => {
  const { isAuthenticated, user } = UseAuth();
  const { openSignupModal } = useModal();
  const [subLoading, setSubLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      openSignupModal();
      return null;
    }
    if (userSubscription?.plan.toLowerCase() === name.toLowerCase()) {
      toast.warning("You are already on this plan", {
        description: "You are already on this plan",
      });
      return null;
    }
    if (name.toLocaleLowerCase() === "enterprise") {
      navigate("/contact");
      return null;
    }

    setSubLoading(true);

    const res = await fetch(`${baseUrl}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user.id,
        plan: name.toLowerCase(),
      }),
    });

    if (!res.ok) {
      setSubLoading(false);
      return toast.error("Failed to create checkout session", {
        description: "Please try again later.",
      });
    }

    const data = await res.json();
    window.location.href = data.checkout_url;
  };

  return (
    <Card
      className={`flex flex-col h-full ${
        popular ? "border-primary shadow-lg" : "border-border"
      } bg-white`}
    >
      {popular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium rounded-t-[10px]">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Custom" && (
            <span className="text-muted-foreground ml-1">/month</span>
          )}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1">
                {feature.included ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-muted-foreground/20" />
                )}
              </div>
              <span
                className={
                  feature.included ? "text-foreground" : "text-muted-foreground"
                }
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          disabled={
            userSubscription?.plan.toLowerCase() === name.toLowerCase() ||
            loading ||
            subLoading ||
            (name.toLowerCase() === "free" && !!userSubscription?.plan)
          }
          onClick={handleUpgrade}
          variant={popular ? "default" : "outline"}
          className="w-full"
        >
          {subLoading && (
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
          )}
          {userSubscription?.plan.toLowerCase() === name.toLowerCase()
            ? "Current Plan"
            : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
