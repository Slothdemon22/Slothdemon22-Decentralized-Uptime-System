"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Copy, Check, Terminal, Github, Key, Coins, Server
} from "lucide-react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function ValidatorGuidePage() {
  const router = useRouter()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const steps = [
    {
      icon: <Github className="h-6 w-6" />,
      title: "Clone the Repository",
      description: "Clone the validator repo from GitHub to your local development environment. This repo includes all necessary files to set up your validator.",
      command: "git clone https://github.com/decentralized-uptime-guardian/validator.git",
    },
    {
      icon: <Terminal className="h-6 w-6" />,
      title: "Install Dependencies",
      description: "Navigate into the project directory and install all dependencies using your package manager.",
      command: "cd validator && npm install",
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Configure Environment",
      description: "Create a .env file at the root of the project and provide your validator's private key, location identifier, and the backend API endpoint.",
      command: "VALIDATOR_PRIVATE_KEY=your_private_key_here\nVALIDATOR_LOCATION=US-East\nAPI_ENDPOINT=http://localhost:4242",
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Start the Validator",
      description: "Use the start script to launch your validator. It will register itself with the decentralized network and begin performing uptime checks.",
      command: "npm run start",
    },
    {
      icon: <Coins className="h-6 w-6" />,
      title: "Earn Rewards",
      description: "As your validator operates, it will collect data and report to the network, earning DUG tokens based on accuracy and reliability.",
      command: "",
    },
  ]

  const rewardTiers = [
    {
      tier: "Basic",
      requirements: "Minimum 100 validations per day",
      rewards: "0.01 DUG/token per validation",
      bonus: "5% bonus for >95% accuracy",
    },
    {
      tier: "Standard",
      requirements: "Minimum 500 validations per day",
      rewards: "0.02 DUG/token per validation",
      bonus: "10% bonus for >97% accuracy",
    },
    {
      tier: "Premium",
      requirements: "Minimum 1000 validations per day",
      rewards: "0.03 DUG/token per validation",
      bonus: "15% bonus for >99% accuracy + 5% fee share",
    },
  ]

  const codeExample = `import { ethers } from 'ethers';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const wallet = new ethers.Wallet(process.env.VALIDATOR_PRIVATE_KEY);
const validatorAddress = wallet.address;

async function registerValidator() {
  const signature = await wallet.signMessage(Register validator at ${Date.now()});
  await axios.post(${process.env.API_ENDPOINT}/api/addValidator, {
    publicKey: validatorAddress,
    location: process.env.VALIDATOR_LOCATION,
    signature
  });
}

registerValidator();`

  return (
    <section className="relative min-h-screen bg-background text-white overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background/20 via-background/60 to-background" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-6 py-20"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Server className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Validator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join our decentralized validator network and earn rewards for monitoring uptime and performance across the web.
          </p>
        </div>

        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="grid grid-cols-3 bg-card/20 border border-border/50 rounded-lg mb-8 backdrop-blur-sm">
            <TabsTrigger value="guide">Setup Guide</TabsTrigger>
            <TabsTrigger value="code">Code Example</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="guide">
            <motion.div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-card/30 border border-border/50 rounded-lg p-6 backdrop-blur-sm hover-glow transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-background border border-border/50 rounded-full">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {index + 1}. {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      {step.command && (
                        <div className="relative">
                          <pre className="bg-background p-4 rounded-lg font-mono text-sm overflow-x-auto border border-border/50 whitespace-pre-wrap">
                            {step.command}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(step.command, index)}
                            className="absolute top-2 right-2 hover:text-primary"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="code">
            <motion.div className="bg-card/30 border border-border/50 rounded-lg p-6 backdrop-blur-sm hover-glow">
              <h3 className="text-xl font-semibold mb-4">Validator Script</h3>
              <pre className="bg-background p-4 rounded-lg font-mono text-sm overflow-x-auto border border-border/50 whitespace-pre-wrap">
                {codeExample}
              </pre>
            </motion.div>
          </TabsContent>

          <TabsContent value="rewards">
            <motion.div className="bg-card/30 border border-border/50 rounded-lg p-6 backdrop-blur-sm hover-glow">
              <h3 className="text-xl font-semibold mb-6">Reward Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rewardTiers.map((tier, index) => (
                  <Card key={index} className="bg-background border border-border/50 rounded-lg">
                    <CardHeader>
                      <CardTitle>{tier.tier}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <h4 className="text-sm text-muted-foreground">Requirements</h4>
                        <p>{tier.requirements}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-muted-foreground">Rewards</h4>
                        <p className="text-primary font-semibold">{tier.rewards}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-muted-foreground">Bonuses</h4>
                        <p>{tier.bonus}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  )
}
