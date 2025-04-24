"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
  titleSize?: "default" | "large" | "small";
}

export function SectionHeading({
  title,
  subtitle,
  alignment = "center",
  titleSize = "default",
}: SectionHeadingProps) {
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, delay: 0.2 } 
    },
  };

  // Dynamic classes based on props
  const containerClasses = `max-w-3xl ${
    alignment === "center" ? "mx-auto text-center" : "text-left"
  }`;

  const getTitleClasses = () => {
    const baseClasses = "font-bold tracking-tight";
    
    switch (titleSize) {
      case "large":
        return `${baseClasses} text-4xl md:text-5xl lg:text-6xl`;
      case "small":
        return `${baseClasses} text-2xl md:text-3xl`;
      default:
        return `${baseClasses} text-3xl md:text-4xl`;
    }
  };

  return (
    <div className={containerClasses}>
      <motion.h2
        className={getTitleClasses()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={titleVariants}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="mt-4 text-xl text-muted-foreground"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={subtitleVariants}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}