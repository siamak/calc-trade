# Statsig Analytics Integration

This document describes the Statsig analytics integration implemented in the trading calculator application.

## Overview

Statsig is integrated to track user interactions, form submissions, calculations, and other important events to help understand user behavior and improve the application.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory and add your Statsig client key:

```bash
NEXT_PUBLIC_STATSIG_CLIENT_KEY=your-statsig-client-key-here
```

### 2. Getting Your Statsig Client Key

1. Sign up at [https://statsig.com](https://statsig.com)
2. Create a new project
3. Go to Project Settings > API Keys
4. Copy the Client API Key
5. Add it to your environment variables

## Tracked Events

### Form Interactions

- `form_input_changed`: Tracks when users modify form fields (balance, risk, stoploss, leverage)
- `form_reset`: Tracks when users reset the form

### Calculations

- `calculation_performed`: Tracks when calculations are performed with meaningful values
- `risk_reward_ratio_changed`: Tracks when users adjust the risk/reward ratio

### User Engagement

- `page_viewed`: Tracks page views with locale information
- `theme_changed`: Tracks theme switches (light/dark mode)
- `locale_changed`: Tracks language changes

### PWA Interactions

- `pwa_install_prompt_shown`: Tracks when PWA install prompt is shown
- `pwa_installed`: Tracks when PWA is successfully installed

### External Links

- `external_link_clicked`: Tracks clicks on external links (GitHub profile, repository)

### Error Tracking

- `error_occurred`: Tracks application errors with context

## Implementation Details

### Analytics Utility (`src/lib/analytics.ts`)

- Centralized analytics functions
- Automatic user ID generation and persistence
- Error handling for analytics calls
- Type-safe event tracking

### Statsig Provider (`src/components/providers/statsig-provider.tsx`)

- Wraps the application with Statsig context
- Handles initialization and loading states
- Provides Statsig functionality to child components

### Error Boundary (`src/components/error-boundary.tsx`)

- Catches React errors and tracks them with analytics
- Provides fallback UI for error states
- Automatically reports errors to Statsig

### Page Tracker (`src/components/page-tracker.tsx`)

- Automatically tracks page views
- Includes locale information in tracking

## Usage

### Basic Event Tracking

```typescript
import { analytics } from "@/lib/analytics";

// Track a custom event
analytics.trackEvent("custom_event", {
	property1: "value1",
	property2: "value2",
});

// Use predefined analytics functions
analytics.formInputChanged("balance", 1000);
analytics.calculationPerformed({
	balance: 1000,
	risk: 2,
	stoploss: 1,
	leverage: 10,
	marginSize: 200,
	riskCapital: 20,
});
```

### Adding New Event Types

1. Add the event function to `src/lib/analytics.ts`
2. Import and use the function in your components
3. Update this documentation

## Privacy Considerations

- User IDs are generated locally and stored in localStorage
- No personally identifiable information is tracked
- All tracking respects user privacy preferences
- Analytics data is used only for product improvement

## Development vs Production

- In development, events are tracked but may not appear in Statsig dashboard immediately
- In production, all events are properly tracked and available in Statsig
- Error tracking helps identify issues in both environments

## Troubleshooting

### Events Not Appearing

1. Check that `NEXT_PUBLIC_STATSIG_CLIENT_KEY` is set correctly
2. Verify the client key is valid in Statsig dashboard
3. Check browser console for any analytics errors
4. Ensure Statsig provider is properly wrapping your components

### Common Issues

- **Client key not set**: Events won't be tracked
- **Network issues**: Events may be queued and sent later
- **Invalid client key**: Check Statsig dashboard for correct key

## Analytics Dashboard

Access your analytics data at [https://statsig.com](https://statsig.com) in your project dashboard. You can:

- View real-time events
- Create custom dashboards
- Set up alerts
- Export data for analysis
