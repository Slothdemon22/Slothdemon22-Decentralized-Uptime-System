"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO at TechCorp",
      company: "TechCorp",
      quote: "DecentralWatch has transformed how we approach uptime monitoring. The distributed verification gives us confidence that our services are truly online and performing well globally.",
      avatar: "SJ",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "DevOps Lead",
      company: "BlockFin",
      quote: "After switching to decentralized monitoring, we've eliminated false positives and have much more reliable data about our global API performance. Worth every penny.",
      avatar: "MC",
      rating: 5
    },
    {
      name: "Aisha Patel",
      role: "Infrastructure Engineer",
      company: "CloudScale",
      quote: "The transparency of DecentralWatch is unmatched. Having cryptographic proof of our 99.99% uptime has been invaluable for our enterprise clients and compliance requirements.",
      avatar: "AP",
      rating: 5
    },
    {
      name: "Carlos Rodriguez",
      role: "Network Administrator",
      company: "DataStream",
      quote: "We reduced our monitoring costs by 40% while improving coverage. The alerting system has caught several critical issues that our previous provider missed completely.",
      avatar: "CR",
      rating: 4
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Trusted by Industry Leaders"
          subtitle="Hear from organizations that have transformed their monitoring with DecentralWatch"
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg border border-border/50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-chart-1 text-chart-1" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i + testimonial.rating} className="w-4 h-4 text-muted-foreground" />
                  ))}
                </div>
              </div>
              <blockquote className="flex-1">
                <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
              </blockquote>
              <footer>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
              </footer>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-card border border-border/50 rounded-lg p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:border-r border-border/50 md:pr-8">
              <h3 className="text-4xl md:text-5xl font-bold text-chart-1">99.99%</h3>
              <p className="mt-2 text-muted-foreground">Average uptime for services monitored by DecentralWatch</p>
            </div>
            <div className="text-center md:border-r border-border/50 md:px-8">
              <h3 className="text-4xl md:text-5xl font-bold text-chart-2">1,000+</h3>
              <p className="mt-2 text-muted-foreground">Global verification nodes ensuring accurate monitoring</p>
            </div>
            <div className="text-center md:pl-8">
              <h3 className="text-4xl md:text-5xl font-bold text-chart-3">48%</h3>
              <p className="mt-2 text-muted-foreground">Average cost reduction compared to traditional solutions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}