'use client'
import Script from 'next/script'
import Image from 'next/image'

interface BuyMeCoffeeProps {
  className?: string
}

export default function BuyMeCoffee({ className }: BuyMeCoffeeProps) {
  const handleButtonClick = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // Try to open the BMC widget if it exists
    const widgetButton = document.querySelector('[data-id="BMC-Widget-Launcher"]') as HTMLElement
    if (widgetButton) {
      widgetButton.click()
    } else {
      // Fallback to opening the Buy Me a Coffee page directly
      window.open('https://www.buymeacoffee.com/defendresolutions', '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={className}>
      <h4 className="text-xl font-semibold mb-4 text-foreground">Support My Work ☕</h4>
      <p className="text-muted-foreground mb-6">
        Enjoying my work? Your support helps me create more amazing projects and keep them
        maintained!
      </p>

      {/* Load Buy Me a Coffee widget script lazily */}
      <Script
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        strategy="lazyOnload"
        data-name="BMC-Widget"
        data-cfasync="false"
        data-id="defendresolutions"
        data-description="Support me on Buy me a coffee!"
        data-message=""
        data-color="#FF5F5F"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      />

      {/* Buy Me a Coffee button - clicking opens the widget or page */}
      <div className="flex justify-center my-6">
        <button
          onClick={handleButtonClick}
          className="group relative overflow-hidden rounded-lg transition-all hover:scale-105"
        >
          <Image
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            width={217}
            height={60}
            className="relative z-10"
            loading="lazy"
            quality={90}
          />
          {/* Add a subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-lg bg-yellow-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-150"></div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Every coffee helps fuel late-night coding sessions! 🚀
      </p>
    </div>
  )
}
