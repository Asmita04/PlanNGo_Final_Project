import { useState, useEffect } from 'react';
import { CreditCard, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const RazorpayPayment = ({ reservationId, amount, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const existingScript = document.getElementById('razorpay-checkout-js');
        if (existingScript) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.id = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          setRazorpayLoaded(false);
          resolve(false);
        };
        
        document.head.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  // Create payment order
  const createPaymentOrder = async () => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          reservationId,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw new Error('Failed to create payment order');
    }
  };

  // Verify payment
  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_signature: paymentData.razorpay_signature,
          reservationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error('Payment verification failed');
    }
  };

  // Handle payment process
  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError('Payment gateway not available. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Step 1: Create payment order
      const orderData = await createPaymentOrder();
      
      // Step 2: Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'PlanNGo',
        description: `Payment for Reservation #${reservationId}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on success
            const verificationResult = await verifyPayment(response);
            
            setSuccess(true);
            setLoading(false);
            
            // Call success callback
            if (onSuccess) {
              onSuccess(verificationResult);
            }
          } catch (verifyError) {
            setError(verifyError.message);
            setLoading(false);
            
            if (onError) {
              onError(verifyError);
            }
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled by user');
          },
        },
      };

      // Step 4: Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        setLoading(false);
        const errorMsg = response.error?.description || 'Payment failed';
        setError(errorMsg);
        
        if (onError) {
          onError(new Error(errorMsg));
        }
      });

      rzp.open();
    } catch (error) {
      setLoading(false);
      setError(error.message);
      
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="razorpay-payment">
      {/* Success Message */}
      {success && (
        <div className="payment-message success">
          <CheckCircle size={24} />
          <span>Payment completed successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="payment-message error">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading || !razorpayLoaded || success}
        className="payment-button"
      >
        {loading ? (
          <>
            <Loader className="spinner" size={20} />
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Pay ₹{amount}
          </>
        )}
      </button>

      {/* Razorpay Not Loaded Warning */}
      {!razorpayLoaded && (
        <div className="payment-warning">
          <p>⚠️ Payment gateway loading... Please wait.</p>
        </div>
      )}

      <style jsx>{`
        .razorpay-payment {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payment-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 500;
        }

        .payment-message.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .payment-message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .payment-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payment-button:hover:not(:disabled) {
          background: #5855eb;
          transform: translateY(-1px);
        }

        .payment-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .payment-warning {
          padding: 0.75rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          text-align: center;
        }

        .payment-warning p {
          margin: 0;
          color: #92400e;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default RazorpayPayment;