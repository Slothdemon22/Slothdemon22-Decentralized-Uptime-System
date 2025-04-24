"use client";

import { DivideIcon as LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: any;
  delay?: number;
  className?: string;
  iconClassName?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  delay = 0,
  className,
  iconClassName,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.2 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className={cn(
        "h-full border border-border/60 hover:border-primary/20 transition-all duration-300 hover-glow glass",
        className
      )}>
        <CardHeader>
          <div className={cn(
            "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:animated-gradient",
            iconClassName
          )}>
            <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
          </div>
          <CardTitle className="text-xl group-hover:text-gradient">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}