"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Activity, ArrowRight, CreditCard, DollarSign, Lock, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const stripePromise = loadStripe("pk_test_51PrFee05Xih061cSZB11wBkHrgCxoAIbsx1hB40L0hMGd3zAFpcYIAmEi82ATmqIkXCpEOzOp7mrgZLno5Q5tccU00dhIu9Y5p")

const PaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const handleCreatePaymentIntent = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:4242/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1000 }),
      })

      if (!response.ok) throw new Error("Failed to create checkout session")

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) throw new Error("Stripe.js has not loaded yet")

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) setError(error.message)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!stripe || !elements || !clientSecret) return
    setIsProcessing(true)
    const cardElement = elements.getElement(CardElement)
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement as any },
    })
    if (error) setError(error.message)
    else if (paymentIntent?.status === "succeeded") setPaymentSuccess(true)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-background text-white font-inter">
      <header className="sticky top-0 z-50 w-full h-16 backdrop-blur border-b border-border/50 bg-background/80">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-white">
              DecentralWatch
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-muted-foreground text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/validator" className="hover:text-white transition-colors">Validators</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left */}
          <div className="flex-1">
            <div className="bg-card/30 backdrop-blur border border-border/50 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-white">Secure Payment</h2>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}

              {paymentSuccess ? (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-6 rounded-lg text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                  <p className="text-muted-foreground">Thank you! Your transaction was successful.</p>
                  <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : clientSecret ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Card Details</label>
                    <div className="bg-background/50 border border-border/50 rounded-md p-4">
                      <CardElement options={{ style: { base: { fontSize: "16px", color: "#fff", "::placeholder": { color: "#aaa" } }, invalid: { color: "#f87171" } } }} />
                    </div>
                  </div>
                  <button type="submit" disabled={isProcessing} className="w-full py-3 px-4 rounded-md bg-gradient-to-r from-chart-1 via-chart-2 to-chart-5 text-black font-medium transition duration-300 flex items-center justify-center gap-2">
                    {isProcessing ? (<><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> Processing...</>) : (<>Pay Now <Lock className="h-4 w-4" /></>)}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Click below to initiate your secure payment session.</p>
                  <button onClick={handleCreatePaymentIntent} disabled={isProcessing} className="w-full py-3 px-4 rounded-md bg-gradient-to-r bg-green-400 text-black font-medium transition duration-300 flex items-center justify-center gap-2 cursor-pointer">
                    {isProcessing ? (<><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> Processing...</>) : (<>Start Payment <ArrowRight className="h-4 w-4" /></>)}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="lg:w-96">
            <div className="bg-card/30 backdrop-blur border border-border/50 rounded-xl p-6 shadow-xl sticky top-24">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between border-b border-border/50 pb-3 text-sm text-muted-foreground">
                  <span>Premium Plan</span><span>$10.00</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span><span>$0.00</span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-3 text-white font-semibold">
                  <span>Total</span><span className="text-xl">$10.00</span>
                </div>
              </div>
              <div className="bg-background/50 border border-border/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                <h4 className="text-white font-medium mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Premium Features</h4>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited website monitoring</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Real-time alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Advanced analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 24/7 Support</li>
                </ul>
              </div>
              <div className="text-xs text-muted-foreground text-center mt-6 flex items-center justify-center gap-2">
                <Lock className="h-3 w-3" /> Secure payment powered by Stripe
              </div>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[{ icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
            { icon: CheckCircle2, title: "Money Back", desc: "30-day guarantee" },
            { icon: Lock, title: "Privacy Protected", desc: "No data sharing" },
            { icon: Activity, title: "24/7 Support", desc: "Always available" }].map((item, i) => (
              <div key={i} className="bg-card/30 backdrop-blur border border-border/50 rounded-lg p-4 text-center hover:border-primary/20 transition-colors">
                <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
          ))}
        </div>
      </main>
    </div>
  )
}

const App = () => (
  <Elements stripe={stripePromise}>
    <PaymentPage />
  </Elements>
)

export default App
