import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { CreditCard, Calendar, MapPin, ArrowLeft, Ticket } from 'lucide-react';
import Button from '../components/Button';
import './Review.css';

const Review = () => {
  const navigate = useNavigate();
  const { user, addNotification, bookingState, updateBooking, clearBooking } = useApp();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketType, setTicketType] = useState('GOLD');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (bookingState.event) {
      setQuantity(bookingState.quantity);
      loadTicketPrice();
    }
  }, [user, bookingState, navigate]);

  const loadTicketPrice = async () => {
    if (!bookingState.event?.id) return;
    
    try {
      const price = await api.getPriceForTicketType(bookingState.event.id, ticketType);
      setTicketPrice(price);
    } catch (error) {
      console.error('Error loading ticket price:', error);
      setTicketPrice(bookingState.event?.price || 0);
    }
  };

  useEffect(() => {
    if (ticketType && bookingState.event?.id) {
      loadTicketPrice();
    }
  }, [ticketType, bookingState.event?.id]);

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    };
    loadRazorpay();
  }, []);

  if (!bookingState.event) {
    return (
      <div className="loading-container">
        <p>Loading booking details...</p>
      </div>
    );
  }

  const { event } = bookingState;
  const serviceFee = 0;
  const subtotal = ticketPrice * quantity;
  const totalAmount = subtotal + serviceFee;
  const availableTickets = event?.venue?.capacity ? event.venue.capacity - (event.booked || 0) : 100;

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(availableTickets, newQuantity));
    setQuantity(validQuantity);
    updateBooking(event, validQuantity);
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      addNotification({ message: 'Payment gateway unavailable. Please disable ad blocker and try again.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order via backend
      const orderData = {
        eventId: event.id,
        ticketType: ticketType,
        quantity: quantity,
        totalAmount: totalAmount
      };

      const orderResponse = await api.createRazorpayOrder(orderData);
      
      const options = {
        key: orderResponse.razorpayKey,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        order_id: orderResponse.orderId,
        name: 'PlanNGo',
        description: `Booking for ${event.title}`,
        handler: async (response) => {
          try {
            // Verify payment via backend
            const verificationData = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            };

            await api.verifyPayment(verificationData);
            
            const bookingData = {
              userId: user.id,
              eventId: event.id,
              quantity: quantity,
              totalAmount: totalAmount,
              paymentMethod: 'Razorpay',
              paymentId: response.razorpay_payment_id
            };

            await api.createBooking(bookingData);
            clearBooking();
            addNotification({ message: 'Payment successful! Booking confirmed.', type: 'success' });
            navigate('/user/dashboard');
          } catch (error) {
            addNotification({ message: 'Payment verification failed', type: 'error' });
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '9999999999'
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            addNotification({ message: 'Payment cancelled', type: 'info' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setLoading(false);
        addNotification({ 
          message: `Payment failed: ${response.error?.description || 'Unknown error'}`, 
          type: 'error' 
        });
      });
      
      rzp.open();
    } catch (error) {
      addNotification({ message: 'Failed to create payment order', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="review-page">
      <div className="container">
        <div className="review-header">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/events/${event.id}`)}
            icon={<ArrowLeft size={20} />}
          >
            Back to Event
          </Button>
          <h1>Review Your Booking</h1>
        </div>

        <div className="review-content">
          <div className="review-main">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="event-details">
                <img 
                  src={event.eventImage || event.image || '/placeholder.jpg'} 
                  alt={event.title} 
                  className="event-image"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{new Date(event.startDate || event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>
                        {event.venue?.venueName 
                          ? `${event.venue.venueName}, ${event.venue.city}` 
                          : event.location || 'Location TBD'
                        }
                      </span>
                    </div>
                    <div className="meta-item">
                      <Ticket size={16} />
                      <span>{quantity} ticket{quantity > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="quantity-section">
                <label>Number of Tickets</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={availableTickets}
                  />
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= availableTickets}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-item">
                  <span>Ticket Price</span>
                  <span>₹{ticketPrice}</span>
                </div>
                <div className="price-item">
                  <span>Quantity</span>
                  <span>×{quantity}</span>
                </div>
                <div className="price-item">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="price-item">
                  <span>Service Fee</span>
                  <span>₹{serviceFee}</span>
                </div>
                <div className="price-total">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <Button 
                fullWidth 
                size="lg"
                disabled={loading || !window.Razorpay || quantity <= 0}
                onClick={handlePayment}
                icon={<CreditCard size={20} />}
              >
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </Button>

              {!window.Razorpay && (
                <div className="payment-warning">
                  <p>⚠️ Payment gateway blocked. Please disable ad blocker and refresh the page.</p>
                </div>
              )}
            </div>
          </div>

          <div className="review-sidebar">
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Event</span>
                <span>{event.title}</span>
              </div>
              <div className="summary-item">
                <span>Date</span>
                <span>{new Date(event.startDate || event.date).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>Location</span>
                <span>
                  {event.venue?.venueName 
                    ? `${event.venue.venueName}, ${event.venue.city}` 
                    : event.location || 'Location TBD'
                  }
                </span>
              </div>
              <div className="summary-item">
                <span>Tickets</span>
                <span>{quantity}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;