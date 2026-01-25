import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Users, MessageCircle, Share2, 
  Mic, MicOff, VideoOff, Settings,
  Maximize, Volume2, VolumeX
} from 'lucide-react';
import './VirtualEvent.css';

const VirtualEvent = ({ event }) => {
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simulate live viewer count
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartStream = () => {
    setIsLive(true);
    setViewers(Math.floor(Math.random() * 100) + 50);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        user: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="virtual-event">
      <div className="stream-container">
        <div className="video-player">
          {isLive ? (
            <div className="live-stream">
              <div className="stream-overlay">
                <motion.div 
                  className="live-indicator"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🔴 LIVE
                </motion.div>
                <div className="viewer-count">
                  <Users size={16} />
                  <span>{viewers} watching</span>
                </div>
              </div>
              <div className="stream-placeholder">
                <Video size={64} />
                <p>Live Stream Active</p>
              </div>
            </div>
          ) : (
            <div className="stream-preview">
              <img src={event.image} alt={event.title} />
              <div className="preview-overlay">
                <motion.button
                  className="start-stream-btn"
                  onClick={handleStartStream}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Video size={24} />
                  Start Live Stream
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Stream Controls */}
        <div className="stream-controls">
          <div className="control-group">
            <button 
              className={`control-btn ${isMuted ? 'active' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              className={`control-btn ${isVideoOff ? 'active' : ''}`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            <button className="control-btn">
              <Settings size={20} />
            </button>
          </div>
          
          <div className="control-group">
            <button className="control-btn">
              <Share2 size={20} />
            </button>
            <button className="control-btn">
              <Maximize size={20} />
            </button>
            <button className="control-btn">
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Live Chat */}
      <div className="live-chat">
        <div className="chat-header">
          <MessageCircle size={20} />
          <span>Live Chat</span>
        </div>
        
        <div className="chat-messages">
          {chatMessages.map(msg => (
            <div key={msg.id} className="chat-message">
              <span className="chat-user">{msg.user}:</span>
              <span className="chat-text">{msg.message}</span>
              <span className="chat-time">{msg.timestamp}</span>
            </div>
          ))}
        </div>
        
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default VirtualEvent;