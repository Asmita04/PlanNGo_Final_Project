// Google Maps API Service
const GOOGLE_MAPS_API_KEY = 'Add_Your_Google_Maps_API_Key_Here';

// Indian Metro Cities coordinates
const indianMetroCities = {
  'Mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'Delhi': { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'Chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'Lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },
  'Kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala' }
};

// Transit options for Indian metro cities
const indianTransitOptions = {
  'Mumbai': [
    { name: 'Mumbai Metro', route: 'Line 1, 2, 3', icon: '🚇' },
    { name: 'Local Train', route: 'Western, Central, Harbour Line', icon: '🚆' },
    { name: 'BEST Bus', route: 'Multiple routes', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' }
  ],
  'Delhi': [
    { name: 'Delhi Metro', route: 'Red, Blue, Yellow, Green Lines', icon: '🚇' },
    { name: 'DTC Bus', route: 'Multiple routes', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' },
    { name: 'Rapid Metro', route: 'Gurgaon Line', icon: '🚈' }
  ],
  'Bangalore': [
    { name: 'Namma Metro', route: 'Purple, Green Line', icon: '🚇' },
    { name: 'BMTC Bus', route: 'Vayu Vajra, Volvo', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' }
  ],
  'Hyderabad': [
    { name: 'Hyderabad Metro', route: 'Red, Blue, Green Line', icon: '🚇' },
    { name: 'TSRTC Bus', route: 'Multiple routes', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' }
  ],
  'Chennai': [
    { name: 'Chennai Metro', route: 'Blue, Green Line', icon: '🚇' },
    { name: 'MTC Bus', route: 'Multiple routes', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' }
  ],
  'Kolkata': [
    { name: 'Kolkata Metro', route: 'Line 1, 2, 3', icon: '🚇' },
    { name: 'Tram', route: 'Multiple routes', icon: '🚊' },
    { name: 'Bus', route: 'Multiple routes', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' }
  ],
  'Pune': [
    { name: 'PMPML Bus', route: 'Rainbow, Shivneri', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' },
    { name: 'Pune Metro', route: 'Under Construction', icon: '🚇' }
  ],
  'default': [
    { name: 'Local Bus', route: 'Multiple routes', icon: '🚌' },
    { name: 'Auto Rickshaw', route: 'Available', icon: '🛺' },
    { name: 'Taxi/Cab', route: 'Ola, Uber', icon: '🚕' }
  ]
};

// Get transit options based on city
const getTransitOptionsForCity = (location) => {
  for (const city in indianMetroCities) {
    if (location.includes(city)) {
      return indianTransitOptions[city] || indianTransitOptions['default'];
    }
  }
  return indianTransitOptions['default'];
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Estimate duration based on distance and mode
const estimateDuration = (distance, mode) => {
  const speeds = { DRIVING: 50, TRANSIT: 30, WALKING: 5, BICYCLING: 15 }; // km/h
  const hours = distance / speeds[mode];
  const mins = Math.round(hours * 60);
  if (mins < 60) return `${mins} mins`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} hour${h > 1 ? 's' : ''} ${m > 0 ? m + ' mins' : ''}`;
};

export const mapsService = {
  getUserLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          let message = 'Unable to get your location';
          if (error.code === 1) message = 'Location access denied. Please enable location permissions in your browser.';
          if (error.code === 2) message = 'Location unavailable. Please try again.';
          if (error.code === 3) message = 'Location request timeout. Please try again.';
          reject(new Error(message));
        },
        { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 }
      );
    });
  },

  geocodeAddress: async (address) => {
    // Check Indian metro cities first
    for (const city in indianMetroCities) {
      if (address.includes(city)) {
        return indianMetroCities[city];
      }
    }

    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(proxyUrl + encodeURIComponent(url));
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    return { lat: 28.7041, lng: 77.1025 }; // Default to Delhi
  },

  getDirections: async (origin, destination, travelMode = 'DRIVING') => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    const duration = estimateDuration(distance, travelMode);
    
    return {
      distance: `${distance.toFixed(1)} km`,
      duration: duration,
      steps: [],
      polyline: ''
    };
  },

  getTravelOptions: async (origin, destination, eventLocation) => {
    const modes = ['DRIVING', 'TRANSIT', 'WALKING', 'BICYCLING'];
    const options = [];

    for (const mode of modes) {
      try {
        const directions = await mapsService.getDirections(origin, destination, mode);
        const option = {
          mode,
          ...directions,
          icon: getIconForMode(mode)
        };
        
        // Add transit options for TRANSIT mode
        if (mode === 'TRANSIT') {
          option.transitOptions = getTransitOptionsForCity(eventLocation);
        }
        
        options.push(option);
      } catch (error) {
        console.log(`${mode} not available`);
      }
    }

    return options;
  },

  getMapUrl: (origin, destination) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`;
  }
};

const getIconForMode = (mode) => {
  const icons = {
    DRIVING: '🚗',
    TRANSIT: '🚌',
    WALKING: '🚶',
    BICYCLING: '🚴'
  };
  return icons[mode] || '📍';
};
