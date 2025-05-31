"use client"

import { useState, useEffect } from "react"
import { MoreVertical } from "lucide-react"

export default function AssetDistribution() {
  const [showPercentage, setShowPercentage] = useState(true)
  const [mounted, setMounted] = useState(false)

  const assets = [
    { name: "Bitcoin", symbol: "BTC", color: "#f97316", percentage: 68 },
    { name: "Ethereum", symbol: "ETH", color: "#3b82f6", percentage: 26 },
    { name: "Litecoin", symbol: "LTC", color: "#6b7280", percentage: 4 },
    { name: "Ripple", symbol: "XRP", color: "#374151", percentage: 2 },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderDonutChart = () => {
    if (!mounted) return null

    const size = 200
    const strokeWidth = 20
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    let cumulativePercentage = 0

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />

          {/* Asset segments */}
          {assets.map((asset, index) => {
            const strokeDasharray = `${(asset.percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = (-cumulativePercentage * circumference) / 100
            cumulativePercentage += asset.percentage

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={asset.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:stroke-opacity-80"
              />
            )
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium text-foreground">Total</div>
          <div className="text-xl font-bold text-foreground">$32,170.64</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-foreground">Asset Distribution</h2>
        <button>
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="mb-6">{renderDonutChart()}</div>

      <div className="space-y-3">
        {assets.map((asset, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
              <span className="text-sm text-foreground">{asset.name}</span>
            </div>
            <div className="text-sm font-medium text-foreground">
              {showPercentage
                ? `${asset.percentage}%`
                : `$${((32170.64 * asset.percentage) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          className="text-xs text-primary hover:text-primary/80 transition-colors"
          onClick={() => setShowPercentage(!showPercentage)}
        >
          Show {showPercentage ? "Values" : "Percentages"}
        </button>
      </div>
    </div>
  )
}
