# Buy Me a Coffee Integration

This document explains the "Buy Me a Coffee" integration added to Life Command OS.

## Overview

A "Buy Me a Coffee" widget is integrated into the contact section, allowing visitors to support development.

## Features

- **External Widget**: Uses the official Buy Me a Coffee widget script.
- **Lazy Loading**: The script is loaded lazily (`strategy="lazyOnload"`) to avoid impacting initial page load performance.
- **Responsive Design**: Custom button integration that triggers the widget or opens a new tab.
- **Fallback Support**: If the widget fails to load or is blocked, the button opens the Buy Me a Coffee page in a new tab.

## Implementation Details

### Files

- `components/BuyMeCoffee.tsx`: The main component containing the widget script and button UI.

### Widget Configuration

The widget is configured with the following data attributes in `components/BuyMeCoffee.tsx`:

```tsx
<Script
  src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
  data-name="BMC-Widget"
  data-id="defendresolutions" // Your BMC Username
  data-description="Support me on Buy me a coffee!"
  data-color="#FF5F5F"
  data-position="Right"
  // ... other settings
/>
```

### Usage

1. The component renders a "Support My Work" card.
2. Clicking the button triggers `widgetButton.click()` on the hidden widget trigger.
3. If the widget is not found, it opens `https://www.buymeacoffee.com/defendresolutions`.

## Setup

No backend API keys (Stripe) are required for this implementation as it relies on the hosted Buy Me a Coffee platform.

Ensure the `data-id` matches your Buy Me a Coffee username.
