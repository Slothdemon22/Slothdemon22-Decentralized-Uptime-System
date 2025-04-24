"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "How does decentralized monitoring differ from traditional solutions?",
      answer: "Decentralized monitoring uses a distributed network of independent nodes to verify service uptime, rather than relying on a single provider's infrastructure. This eliminates single points of failure, provides censorship resistance, and delivers more accurate results through consensus mechanisms."
    },
    {
      question: "Is DecentralWatch suitable for mission-critical applications?",
      answer: "Yes, DecentralWatch is specifically designed for mission-critical applications where reliability is paramount. Our distributed architecture provides redundancy and consensus-based verification that exceeds the reliability of traditional monitoring solutions."
    },
    {
      question: "How quickly will I be notified of outages?",
      answer: "On our Professional and Enterprise plans, notifications are sent within seconds of an outage being confirmed by our consensus mechanism. This multi-node verification process virtually eliminates false positives while ensuring rapid notification of real issues."
    },
    {
      question: "Can I integrate DecentralWatch with my existing tools?",
      answer: "Yes, we offer extensive integration options including webhooks, API access, and direct connections to popular platforms like Slack, PagerDuty, Opsgenie, and more. Our system is designed to fit seamlessly into your existing workflows."
    },
    {
      question: "What kind of endpoints can be monitored?",
      answer: "DecentralWatch can monitor virtually any public-facing endpoint, including websites, APIs, servers, and services. We support HTTP(S), TCP, ICMP, DNS, and custom protocol monitoring with comprehensive SSL/TLS verification."
    },
    {
      question: "How is data secured and who has access to my monitoring information?",
      answer: "All monitoring data is encrypted both in transit and at rest. You maintain full ownership and control over your data. Our decentralized architecture means that no single entity has complete access to your monitoring information without your explicit permission."
    },
    {
      question: "Can I run my own monitoring nodes in your network?",
      answer: "Yes, on Enterprise plans you can deploy private monitoring nodes within your infrastructure that still participate in the broader network consensus. This gives you even greater control while maintaining the benefits of decentralized verification."
    },
    {
      question: "What happens if my service is falsely reported as down?",
      answer: "Our consensus mechanism requires multiple independent verifications before an outage is confirmed, virtually eliminating false positives. In the rare case of disagreement, our system automatically increases monitoring frequency and breadth to quickly resolve any discrepancies."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about DecentralWatch"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg bg-card overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Still have questions? We're here to help.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outline">Contact Support</Button>
            <Button>View Documentation</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Import needed for the button component
import { Button } from "@/components/ui/button";