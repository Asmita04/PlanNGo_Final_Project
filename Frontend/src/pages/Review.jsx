import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { CreditCard, Calendar, MapPin, ArrowLeft, Plus, Minus } from 'lucide-react';
import Button from '../components/Button';
import './Review.css';

const Review = () => {
  const navigate = useNavigate();
  const { user, addNotification, bookingState, updateBooking, clearBooking } = useApp();
  const [loading, setLoading] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (bookingState.event) {
      if (bookingState.event.eventId || bookingState.event.id) {
        fetchTicketTypes(bookingState.event.eventId || bookingState.event.id);
      } else {
        // Fallback or error handling
        setLoadingTickets(false);
      }
    }
  }, [user, bookingState, navigate]);

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const fetchTicketTypes = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:9090/event-tickets/${eventId}/details`);
      if (response.ok) {
        const data = await response.json();
        setTicketTypes(data);

        // Initialize quantities map with 0
        const initialQuantities = {};
        if (data && Array.isArray(data)) {
          data.forEach(t => initialQuantities[t.ticketTypeId] = 0);
        }
        setTicketQuantities(initialQuantities);
      } else {
        console.error('Failed to fetch ticket types');
      }
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleQuantityChange = (ticketId, delta, max) => {
    setTicketQuantities(prev => {
      const current = prev[ticketId] || 0;
      const newValue = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [ticketId]: newValue };
    });
  };

  if (!bookingState.event) {
    return (
      <div className="loading-container">
        <p>Loading booking details...</p>
      </div>
    );
  }

  const { event } = bookingState;

  // Calculate Totals based on mixed selection
  const selectedTicketsList = ticketTypes.map(t => ({
    ...t,
    quantity: ticketQuantities[t.ticketTypeId] || 0
  })).filter(t => t.quantity > 0);

  const totalTickets = selectedTicketsList.reduce((sum, t) => sum + t.quantity, 0);
  const totalAmount = selectedTicketsList.reduce((sum, t) => sum + (t.price * t.quantity), 0);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      addNotification({ message: 'Payment gateway unavailable. Please disable ad blocker and try again.', type: 'error' });
      return;
    }

    if (totalTickets === 0) {
      addNotification({ message: 'Please select at least one ticket', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      // Create a description of selected items
      const description = selectedTicketsList.map(t => `${t.typeName} x${t.quantity}`).join(', ');

      const options = {
        key: 'rzp_test_Rv0f4eyqBgZIGr',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'PlanNGo',
        description: `Booking: ${description}`,
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          qr: true
        },
        handler: async (response) => {
          try {
            // Processing multiple bookings sequentially to simulate cart booking
            // Note: In a real app, this should be a single bulk endpoint.
            const paymentId = response.razorpay_payment_id || 'demo_' + Date.now();

            const bookingPromises = selectedTicketsList.map(ticket => {
              const bookingData = {
                userId: user.id,
                eventId: event.id,
                quantity: ticket.quantity,
                totalAmount: ticket.price * ticket.quantity,
                ticketTypeId: ticket.ticketTypeId,
                paymentMethod: 'Razorpay',
                paymentId: paymentId
              };
              return api.createBooking(bookingData);
            });

            await Promise.all(bookingPromises);

            clearBooking();
            addNotification({ message: 'Payment successful! Tickets booked.', type: 'success' });
            navigate('/user/dashboard');
          } catch (error) {
            console.error('Booking creation failed', error);
            addNotification({ message: 'Booking failed', type: 'error' });
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
      addNotification({ message: 'Failed to initiate payment', type: 'error' });
      setLoading(false);
    }
  };

  const getTicketColor = (typeName) => {
    const type = typeName?.toUpperCase();
    switch (type) {
      case 'GOLD': return '#FFD700';
      case 'SILVER': return '#C0C0C0';
      case 'PLATINUM': return '#E5E4E2';
      default: return '#818cf8';
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
                  </div>
                </div>
              </div>

              {loadingTickets ? (
                <div className="loading-tickets">Loading ticket options...</div>
              ) : ticketTypes.length > 0 ? (
                <div className="ticket-selection">
                  <h3>Select Tickets</h3>
                  <div className="ticket-list-vertical">
                    {ticketTypes.map((ticket) => {
                      const qty = ticketQuantities[ticket.ticketTypeId] || 0;
                      const color = getTicketColor(ticket.typeName);

                      return (
                        <div
                          key={ticket.ticketTypeId}
                          className={`ticket-row ${qty > 0 ? 'active' : ''}`}
                          style={{ '--ticket-color': color }}
                        >
                          <div className="ticket-row-info">
                            <span className="ticket-row-name" style={{ color: color }}>
                              {ticket.typeName}
                            </span>
                            <span className="ticket-row-price">₹{ticket.price}</span>
                            <span className="ticket-row-avail">{ticket.totalQuantity} available</span>
                          </div>

                          <div className="ticket-row-controls">
                            <button
                              className="qty-btn"
                              onClick={() => handleQuantityChange(ticket.ticketTypeId, -1, ticket.totalQuantity)}
                              disabled={qty <= 0}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="qty-val">{qty}</span>
                            <button
                              className="qty-btn"
                              onClick={() => handleQuantityChange(ticket.ticketTypeId, 1, ticket.totalQuantity)}
                              disabled={qty >= ticket.totalQuantity}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="no-tickets-msg">No ticket details available.</div>
              )}

              <div className="price-breakdown">
                {selectedTicketsList.length > 0 ? (
                  selectedTicketsList.map(t => (
                    <div key={t.ticketTypeId} className="price-item">
                      <span>{t.typeName} (x{t.quantity})</span>
                      <span>₹{t.price * t.quantity}</span>
                    </div>
                  ))
                ) : (
                  <div className="price-item empty">
                    <span>No tickets selected</span>
                    <span>-</span>
                  </div>
                )}

                <div className="price-total">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                disabled={loading || !window.Razorpay || totalTickets <= 0}
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
                <span>Tickets Selected</span>
                <span>{totalTickets}</span>
              </div>

              <div className="summary-divider"></div>

              {selectedTicketsList.map(t => (
                <div key={t.ticketTypeId} className="summary-subitem">
                  <span style={{ color: getTicketColor(t.typeName) }}>{t.typeName}</span>
                  <span>x{t.quantity}</span>
                </div>
              ))}

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