import { useEffect, useState } from "react";
import { UseAuth } from "@/lib/auth/AuthContext";
import { SingleTier } from "./SingleTier";

const PricingTiers = ({
  title = "Choose Your Plan",
  subtitle = "Select the perfect plan for your needs",
}) => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, getProfile } = UseAuth();
  const [userSubscription, setUserSubscription] = useState(null);
  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      description: "Start for free – perfect for personal and light use",
      buttonText: "Get Started",
      popular: false,
      features: [
        { name: "30 transcript attempts per month", included: true },
        { name: "Basic transcript formatting", included: true },
        { name: "Download transcripts as TXT", included: true },
        { name: "AI assistant to explain transcript content", included: true },
        { name: "Multi-language support", included: true },
        { name: "Priority support", included: false },
      ],
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "Full access for creators, educators, and professionals",
      buttonText: "Upgrade to Pro",
      popular: true,
      features: [
        { name: "1000 transcript attempts per month", included: true },
        { name: "Advanced formatting tools", included: true },
        { name: "Download transcripts as TXT", included: true },
        { name: "AI assistant to summarize and explain", included: true },
        { name: "Search & highlight within transcripts", included: true },
        { name: "Priority support", included: false },
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Scalable tools and integrations for your growing team",
      buttonText: "Contact Sales",
      popular: false,
      features: [
        { name: "Everything in Pro plan", included: true },
        { name: "Early access to upcoming features", included: true },
        { name: "API access (coming soon)", included: true },
        { name: "Custom usage limits", included: true },
        { name: "Team-based collaboration", included: true },
        { name: "Dedicated onboarding & support", included: true },
      ],
    },
  ];

  useEffect(() => {
    const checkUserSubscription = async () => {
      if (isAuthenticated) {
        setLoading(true);
        const data = await getProfile();
        setUserSubscription({ plan: data.subscription_plan });
      }
      setLoading(false);
    };
    checkUserSubscription();
  }, [isAuthenticated, getProfile]);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <SingleTier
              key={index}
              loading={loading}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              buttonText={tier.buttonText}
              popular={tier.popular}
              userSubscription={userSubscription}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All plans include basic customer support and regular updates.</p>
          <p className="mt-2">
            Need a custom solution?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact us
            </a>{" "}
            for more information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
