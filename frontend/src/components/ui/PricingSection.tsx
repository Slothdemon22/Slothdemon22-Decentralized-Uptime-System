"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui//section-heading";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for small projects and personal websites",
      features: [
        "5 Monitored Endpoints",
        "10-minute Interval Checks",
        "Email Alerts",
        "7-day History Retention",
        "Basic Performance Metrics"
      ],
      popular: false,
      buttonVariant: "outline" as const
    },
    {
      name: "Professional",
      price: "$79",
      description: "For growing businesses with critical online services",
      features: [
        "25 Monitored Endpoints",
        "1-minute Interval Checks",
        "Email, SMS, Webhook Alerts",
        "30-day History Retention",
        "Advanced Analytics Dashboard",
        "API Access",
        "Custom Status Pages"
      ],
      popular: true,
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "$199",
      description: "For large organizations with complex infrastructure",
      features: [
        "Unlimited Endpoints",
        "30-second Interval Checks",
        "Multi-channel Alert System",
        "1-year History Retention",
        "Custom Analytics and Reporting",
        "Priority Support",
        "SLA Management",
        "Dedicated Account Manager"
      ],
      popular: false,
      buttonVariant: "outline" as const
    }
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that fits your monitoring needs"
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-lg overflow-hidden border ${
                plan.popular 
                  ? "border-primary shadow-lg" 
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className={`bg-card p-8 ${plan.popular ? "pt-12" : ""}`}>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>
                
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle2 className={`h-5 w-5 mr-2 flex-shrink-0 ${
                        plan.popular ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Button variant={plan.buttonVariant} className="w-full">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-muted/30 rounded-lg p-8 text-center"
        >
          <h3 className="text-xl font-semibold">Need a custom solution?</h3>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Contact our team for custom plans designed for specific requirements, including private deployments and enterprise integrations.
          </p>
          <Button variant="outline" className="mt-6">
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </section>
  );
}