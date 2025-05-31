"use client"

import { useState, useEffect } from "react"
import { Wallet, ArrowDownLeft, ArrowUpRight, RefreshCw, Download, ArrowLeftRight, Repeat } from "lucide-react"
import WalletBalance from "@/components/wallet/wallet-balance"
import AssetDistribution from "@/components/wallet/asset-distribution"
import TransactionHistory from "@/components/wallet/transaction-history"
import QuickActions from "@/components/wallet/quick-actions"
import RecentActivity from "@/components/wallet/recent-activity"

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "deposit" | "withdraw" | "transfer" | "convert">("overview")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-4 bg-background min-h-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading wallet...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-background min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-emerald-100 rounded-full p-2 mr-3 dark:bg-emerald-900">
            <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
            <p className="text-muted-foreground text-sm">Manage your crypto assets</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-card border border-border rounded-md text-sm font-medium flex items-center hover:bg-muted/50 text-foreground transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors">
            <RefreshCw className="h-4 w-4 inline-block mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex overflow-x-auto pb-2 -mx-1">
          <button
            className={`px-4 py-2 mx-1 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "bg-emerald-600 text-white"
                : "bg-card border border-border text-foreground/90 hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 mx-1 rounded-md text-sm font-medium whitespace-nowrap flex items-center transition-colors ${
              activeTab === "deposit"
                ? "bg-emerald-600 text-white"
                : "bg-card border border-border text-foreground/90 hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("deposit")}
          >
            <ArrowDownLeft className="h-4 w-4 mr-1" />
            Deposit
          </button>
          <button
            className={`px-4 py-2 mx-1 rounded-md text-sm font-medium whitespace-nowrap flex items-center transition-colors ${
              activeTab === "withdraw"
                ? "bg-emerald-600 text-white"
                : "bg-card border border-border text-foreground/90 hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("withdraw")}
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Withdraw
          </button>
          <button
            className={`px-4 py-2 mx-1 rounded-md text-sm font-medium whitespace-nowrap flex items-center transition-colors ${
              activeTab === "transfer"
                ? "bg-emerald-600 text-white"
                : "bg-card border border-border text-foreground/90 hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("transfer")}
          >
            <ArrowLeftRight className="h-4 w-4 mr-1" />
            Transfer
          </button>
          <button
            className={`px-4 py-2 mx-1 rounded-md text-sm font-medium whitespace-nowrap flex items-center transition-colors ${
              activeTab === "convert"
                ? "bg-emerald-600 text-white"
                : "bg-card border border-border text-foreground/90 hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("convert")}
          >
            <Repeat className="h-4 w-4 mr-1" />
            Convert
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <WalletBalance />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TransactionHistory />
            </div>
            <div className="space-y-6">
              <AssetDistribution />
              <RecentActivity />
            </div>
          </div>
        </>
      )}

      {activeTab === "deposit" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-foreground">Deposit Funds</h2>
          <p className="text-muted-foreground mb-6">Select a cryptocurrency to generate a deposit address</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">Select Asset</label>
            <select className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
              <option>Bitcoin (BTC)</option>
              <option>Ethereum (ETH)</option>
              <option>Litecoin (LTC)</option>
              <option>Ripple (XRP)</option>
              <option>Cardano (ADA)</option>
            </select>
          </div>

          <div className="bg-muted/50 border border-border rounded-md p-4 mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-card p-2 rounded-md border border-border">
                {/* QR Code placeholder */}
                <div className="h-48 w-48 bg-muted border border-border/80 flex items-center justify-center">
                  <span className="text-muted-foreground">QR Code</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-muted-foreground mb-1">Deposit Address</label>
              <div className="flex">
                <input
                  type="text"
                  value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                  readOnly
                  className="w-full border border-border rounded-l-md px-3 py-2 bg-card text-foreground"
                />
                <button className="bg-emerald-600 text-white px-4 rounded-r-md hover:bg-emerald-700 transition-colors">
                  Copy
                </button>
              </div>
            </div>

            <div className="text-sm text-foreground/80">
              <p className="font-medium mb-2">Important:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Send only Bitcoin (BTC) to this deposit address</li>
                <li>Ensure the network is Bitcoin (BTC)</li>
                <li>Minimum deposit: 0.0001 BTC</li>
                <li>Your deposit will be available after 2 network confirmations</li>
              </ul>
            </div>
          </div>

          <button className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 transition-colors">
            I've Completed My Deposit
          </button>
        </div>
      )}

      {activeTab === "withdraw" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-foreground">Withdraw Funds</h2>
          <p className="text-muted-foreground mb-6">Complete the form below to withdraw your crypto</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Select Asset</label>
              <select className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>Litecoin (LTC)</option>
                <option>Ripple (XRP)</option>
                <option>Cardano (ADA)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Recipient Address</label>
              <input
                type="text"
                placeholder="Enter recipient's wallet address"
                className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Network</label>
              <select className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
                <option>Bitcoin (BTC)</option>
                <option>Bitcoin Cash (BCH)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Amount</label>
              <div className="flex">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border border-border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground"
                />
                <button className="bg-muted text-foreground px-4 rounded-r-md border-t border-r border-b border-border hover:bg-muted/80 transition-colors">
                  MAX
                </button>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Available: 0.5473 BTC</span>
                <span className="text-xs text-muted-foreground">≈ $21,892.00</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-md p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-foreground/80">Network Fee</span>
              <span className="text-sm font-medium text-foreground">0.0005 BTC</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-foreground/80">You Will Receive</span>
              <span className="text-sm font-medium text-foreground">0.0995 BTC</span>
            </div>
          </div>

          <button className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 transition-colors">
            Withdraw Now
          </button>
        </div>
      )}

      {activeTab === "transfer" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-foreground">Transfer Funds</h2>
          <p className="text-muted-foreground mb-6">Transfer crypto between your accounts</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">From</label>
              <select className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
                <option>Spot Wallet</option>
                <option>Trading Account</option>
                <option>Savings Account</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">To</label>
              <select className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
                <option>Trading Account</option>
                <option>Spot Wallet</option>
                <option>Savings Account</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Asset</label>
              <select className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>Litecoin (LTC)</option>
                <option>Ripple (XRP)</option>
                <option>Cardano (ADA)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Amount</label>
              <div className="flex">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border border-border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground"
                />
                <button className="bg-muted text-foreground px-4 rounded-r-md border-t border-r border-b border-border hover:bg-muted/80 transition-colors">
                  MAX
                </button>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Available: 0.5473 BTC</span>
                <span className="text-xs text-muted-foreground">≈ $21,892.00</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 transition-colors">
            Transfer Now
          </button>
        </div>
      )}

      {activeTab === "convert" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-foreground">Convert Crypto</h2>
          <p className="text-muted-foreground mb-6">Convert one cryptocurrency to another</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">From</label>
              <div className="flex space-x-2">
                <select className="flex-1 border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
                  <option>Bitcoin (BTC)</option>
                  <option>Ethereum (ETH)</option>
                  <option>Litecoin (LTC)</option>
                  <option>Ripple (XRP)</option>
                  <option>Cardano (ADA)</option>
                </select>
                <input
                  type="number"
                  placeholder="0.00"
                  className="flex-1 border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Available: 0.5473 BTC</span>
                <span className="text-xs text-muted-foreground">≈ $21,892.00</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">To</label>
              <div className="flex space-x-2">
                <select className="flex-1 border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-card text-foreground">
                  <option>Ethereum (ETH)</option>
                  <option>Bitcoin (BTC)</option>
                  <option>Litecoin (LTC)</option>
                  <option>Ripple (XRP)</option>
                  <option>Cardano (ADA)</option>
                </select>
                <input
                  type="number"
                  placeholder="0.00"
                  readOnly
                  className="flex-1 border border-border rounded-md px-3 py-2 bg-muted text-foreground"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">You will receive: ~8.45 ETH</span>
                <span className="text-xs text-muted-foreground">≈ $21,300.00</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-md p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-foreground/80">Exchange Rate</span>
              <span className="text-sm font-medium text-foreground">1 BTC = 15.42 ETH</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-foreground/80">Conversion Fee</span>
              <span className="text-sm font-medium text-foreground">0.1%</span>
            </div>
          </div>

          <button className="w-full bg-emerald-600 text-white py-2 rounded-md font-medium hover:bg-emerald-700 transition-colors">
            Convert Now
          </button>
        </div>
      )}
    </div>
  )
}
