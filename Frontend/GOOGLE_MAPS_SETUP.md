# Google Maps Travel Options Feature - Setup Guide

## 🗺️ Feature Overview

This feature shows travel options from the user's location to the event venue using Google Maps API, including:
- **Driving** directions with estimated time and distance
- **Public Transit** options
- **Walking** directions
- **Bicycling** routes
- Direct link to open in Google Maps app

## 🔑 Google Maps API Setup

### Step 1: Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Directions API**
   - **Geocoding API**
   - **Geolocation API**

4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### Step 2: Configure API Key

Open `src/services/maps.js` and replace:

```javascript
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
```

With your actual API key:

```javascript
const GOOGLE_MAPS_API_KEY = 'AIzaSyC...your-actual-key';
```

### Step 3: Restrict API Key (Recommended)

In Google Cloud Console:
1. Click on your API key
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your domains:
   - `localhost:5173/*` (for development)
   - `yourdomain.com/*` (for production)

4. Under **API restrictions**, select **Restrict key**
5. Select only the APIs you need:
   - Directions API
   - Geocoding API
   - Maps JavaScript API

## 🚀 How It Works

### User Flow

1. User opens event details page
2. Clicks "Get Directions" button
3. Browser requests location permission
4. System calculates routes for all travel modes
5. Displays travel options with time and distance
6. User can open full directions in Google Maps

### Technical Flow

```javascript
// 1. Get user location
const userLocation = await mapsService.getUserLocation();

// 2. Geocode event address
const eventLocation = await mapsService.geocodeAddress(address);

// 3. Get travel options
const options = await mapsService.getTravelOptions(userLocation, eventLocation);

// 4. Display results
```

## 📱 Features

### Travel Modes
- 🚗 **Driving**: Car directions with traffic
- 🚌 **Transit**: Public transportation options
- 🚶 **Walking**: Pedestrian routes
- 🚴 **Bicycling**: Bike-friendly paths

### Information Displayed
- Estimated travel time
- Total distance
- Travel mode icon
- Direct link to Google Maps

## 🔒 Privacy & Permissions

### Location Permission
- Requests user permission before accessing location
- Works only with HTTPS (or localhost)
- User can deny permission
- Graceful error handling if denied

### Data Usage
- Location data is NOT stored
- Only used for calculating directions
- No tracking or analytics
- Complies with privacy regulations

## 💡 Usage Example

```jsx
import TravelOptions from '../components/TravelOptions';

<TravelOptions 
  eventLocation="San Francisco, CA" 
  eventVenue="Moscone Center" 
/>
```

## 🎨 Customization

### Change Default Travel Mode
Edit `src/services/maps.js`:

```javascript
getDirections: async (origin, destination, travelMode = 'TRANSIT') => {
  // Change 'DRIVING' to 'TRANSIT', 'WALKING', or 'BICYCLING'
}
```

### Add More Travel Modes
```javascript
const modes = ['DRIVING', 'TRANSIT', 'WALKING', 'BICYCLING', 'TWO_WHEELER'];
```

### Customize Icons
Edit `getIconForMode` function:

```javascript
const icons = {
  DRIVING: '🚗',
  TRANSIT: '🚌',
  WALKING: '🚶',
  BICYCLING: '🚴',
  TWO_WHEELER: '🛵'
};
```

## 🐛 Troubleshooting

### "Geolocation is not supported"
- User's browser doesn't support geolocation
- Solution: Show manual address input

### "User denied location access"
- User clicked "Block" on permission prompt
- Solution: Show instructions to enable location

### "Address not found"
- Invalid or incomplete address
- Solution: Verify event address format

### API Key Errors
- Check if API key is correct
- Verify APIs are enabled
- Check API restrictions
- Ensure billing is enabled (Google requires it)

### CORS Errors
- Use server-side proxy for API calls
- Or use Google Maps JavaScript API instead

## 💰 Pricing

Google Maps API pricing (as of 2024):
- **Directions API**: $5 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests
- **Free tier**: $200 credit per month (~40,000 requests)

### Cost Optimization
1. Cache geocoded addresses
2. Limit requests per user
3. Use client-side Maps JavaScript API
4. Implement request throttling

## 🔄 Alternative: Client-Side Implementation

For better performance and lower costs, use Maps JavaScript API:

```html
<!-- Add to index.html -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

```javascript
// Use DirectionsService
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
```

## 📊 Analytics

Track usage:
```javascript
// Add to TravelOptions component
const trackDirectionsRequest = (mode) => {
  // Send to analytics
  console.log(`Directions requested: ${mode}`);
};
```

## 🌐 Internationalization

Support multiple languages:
```javascript
const url = `https://maps.googleapis.com/maps/api/directions/json?...&language=es`;
```

## ✅ Testing

### Test Locations
```javascript
// Test with known locations
const testOrigin = { lat: 37.7749, lng: -122.4194 }; // San Francisco
const testDestination = { lat: 34.0522, lng: -118.2437 }; // Los Angeles
```

### Mock for Development
```javascript
// Mock getUserLocation for testing
getUserLocation: () => Promise.resolve({ lat: 37.7749, lng: -122.4194 })
```

## 🎯 Best Practices

1. **Always handle errors gracefully**
2. **Show loading states**
3. **Cache geocoded addresses**
4. **Respect user privacy**
5. **Provide fallback options**
6. **Test on mobile devices**
7. **Monitor API usage**
8. **Implement rate limiting**

## 📱 Mobile Optimization

- Large touch targets
- Responsive design
- Native map app integration
- Offline fallback message

## 🔗 Useful Links

- [Google Maps Platform](https://developers.google.com/maps)
- [Directions API Docs](https://developers.google.com/maps/documentation/directions)
- [Geocoding API Docs](https://developers.google.com/maps/documentation/geocoding)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

## 🎉 Feature Complete!

The travel options feature is now integrated and ready to use. Users can:
- ✅ See multiple travel options
- ✅ View estimated time and distance
- ✅ Open directions in Google Maps
- ✅ Choose their preferred travel mode

**Remember to add your Google Maps API key before testing!**
