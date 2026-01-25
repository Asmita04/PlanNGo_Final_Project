import { Loader } from 'lucide-react';
import './Loading.css';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-wrapper">
      <Loader className="loading-spinner" size={48} />
      <p>{message}</p>
    </div>
  );
};

export default Loading;
