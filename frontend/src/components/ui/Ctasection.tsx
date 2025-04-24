"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-transparent to-chart-5/10" />
        <svg
          className="absolute inset-0 w-full h-full"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="heroGrid"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <rect width="1" height="1" fill="currentColor" opacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to experience decentralized uptime monitoring?
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Join thousands of organizations that trust DecentralWatch for their critical infrastructure.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Get Started Now 
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Start with a 14-day free trial.
          </p>
        </motion.div>
      </div>
    </section>
  );
}