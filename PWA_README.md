# PWA (Progressive Web App) Features

This project has been configured as a Progressive Web App (PWA) with full offline functionality. Here's what's included and how to use it.

## 🚀 PWA Features

### Core PWA Functionality

- **Installable**: Users can install the app on their device (desktop, mobile, tablet)
- **Offline Support**: App works without internet connection
- **App-like Experience**: Full-screen mode, standalone display
- **Responsive Design**: Optimized for all screen sizes

### Offline Capabilities

- **Static Asset Caching**: Icons, fonts, and images are cached for offline use
- **Dynamic Content Caching**: API responses and dynamic content are cached with smart strategies
- **Network Fallback**: App gracefully falls back to cached content when offline
- **Background Sync**: Handles offline actions when connection is restored

### Caching Strategies

- **Cache First**: For static assets (images, fonts, CSS, JS)
- **Network First**: For dynamic content and API calls
- **Stale While Revalidate**: For frequently updated content

## 📱 Installation

### For Users

1. **Desktop**: Look for the install button in the browser address bar or use the "Install App" button
2. **Mobile**: Use the "Add to Home Screen" option in your browser menu
3. **Tablet**: Same as mobile, with optimized touch interface

### Install Button

- Appears automatically when the app can be installed
- Located in the bottom-right corner
- Only shows when installation is possible

## 🔧 Technical Implementation

### Service Worker

- **File**: `/public/sw-custom.js`
- **Registration**: Automatic via `usePWA` hook
- **Caching**: Multiple cache strategies for different content types
- **Updates**: Automatic service worker updates

### PWA Configuration

- **Next.js Config**: Uses `next-pwa` plugin
- **Manifest**: `/public/manifest.json` with app metadata
- **Icons**: Multiple sizes for different devices and contexts
- **Meta Tags**: Comprehensive PWA meta tags in layout

### State Management

- **Hook**: `usePWA()` for PWA state management
- **Installation**: Tracks install prompt and app installation status
- **Online/Offline**: Monitors connection status
- **Updates**: Handles app updates and service worker updates

## 🎨 UI Components

### PWA Install Button

- **Component**: `PWAInstallButton`
- **Location**: Fixed bottom-right corner
- **Visibility**: Only shows when installation is possible
- **Styling**: Consistent with app theme

### Offline Indicator

- **Component**: `OfflineIndicator`
- **Location**: Fixed top-right corner
- **States**: Online (green) / Offline (red)
- **Icon**: WiFi icon for online, WiFi-off for offline

## 📋 PWA Manifest

The app manifest includes:

- App name and description
- Multiple icon sizes for different devices
- Theme colors and background colors
- Display mode (standalone)
- Orientation preferences
- App shortcuts
- Categories and language settings

## 🚦 Caching Strategy

### Static Assets (Cache First)

- Images, fonts, CSS, JavaScript
- Cached immediately on first visit
- Long-term storage (24 hours to 1 year)

### Dynamic Content (Network First)

- API responses, page content
- Network request first, cache fallback
- Short-term storage (24 hours)

### Critical Resources

- App shell, manifest, icons
- Always available offline
- Immediate caching on install

## 🔄 Update Process

1. **Service Worker**: Automatically updates when new version is available
2. **Cache Management**: Old caches are cleaned up automatically
3. **User Notification**: Users can manually check for updates
4. **Background Updates**: Updates happen in the background

## 📱 Device Support

### Desktop

- Chrome, Edge, Firefox, Safari
- Install via browser menu or install button
- Full PWA functionality

### Mobile

- iOS Safari (limited PWA support)
- Android Chrome (full PWA support)
- Add to home screen functionality

### Tablet

- Same as mobile with optimized touch interface
- Responsive design for all screen sizes

## 🧪 Testing

### Development

- PWA features disabled in development mode
- Service worker not registered during development
- Test in production build

### Production

- Full PWA functionality enabled
- Service worker automatically registered
- Offline functionality available

### Testing Offline

1. Build and deploy the app
2. Visit the app and let it cache content
3. Go offline (disable network)
4. Verify app works without internet
5. Check cached content is available

## 🚨 Troubleshooting

### Common Issues

- **Install button not showing**: Check if app is already installed
- **Offline not working**: Ensure service worker is registered
- **Cache not updating**: Clear browser cache and reload

### Debug Commands

```javascript
// Check service worker registration
navigator.serviceWorker.getRegistration();

// Check cache contents
caches.keys().then((keys) => console.log(keys));

// Clear all caches
caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
```

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Next.js PWA Plugin](https://github.com/shadowwalker/next-pwa)

## 🔮 Future Enhancements

- Push notifications
- Background sync for offline actions
- Advanced caching strategies
- Performance monitoring
- Analytics for offline usage


