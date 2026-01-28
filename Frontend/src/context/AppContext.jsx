import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [bookingState, setBookingState] = useState({
    event: null,
    quantity: 1,
    totalPrice: 0
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedFavorites = localStorage.getItem('favorites');
    const savedBookingState = localStorage.getItem('bookingState');
    
    if (savedUser && savedUser !== 'undefined') setUser(JSON.parse(savedUser));
    if (savedFavorites && savedFavorites !== 'undefined') setFavorites(JSON.parse(savedFavorites));
    if (savedBookingState && savedBookingState !== 'undefined') setBookingState(JSON.parse(savedBookingState));
  }, []);



  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    setCart([]);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };



  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleFavorite = (eventId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const updateBooking = (event, quantity) => {
    const totalPrice = event.price * quantity;
    const newBookingState = { event, quantity, totalPrice };
    console.log('Updating booking state:', newBookingState);
    setBookingState(newBookingState);
    // Also  save to localStorage for persistence
    localStorage.setItem('bookingState', JSON.stringify(newBookingState));
  };

  const clearBooking = () => {
    setBookingState({ event: null, quantity: 1, totalPrice: 0 });
    localStorage.removeItem('bookingState');
  };

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      notifications,
      addNotification,
      removeNotification,
      favorites,
      toggleFavorite,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      bookingState,
      updateBooking,
      clearBooking
    }}>
      {children}
    </AppContext.Provider>
  );
};
