// This is a new component that displays the simulation in a full-screen modal.

import { useEffect, useRef } from 'react';

// Define the shape of the data this component expects
interface TrafficSignal {
  name: string;
  videoUrl: string;
}

interface SimulationModalProps {
  signal: TrafficSignal;
  onClose: () => void; // A function to call when the modal should close
}

const SimulationModal: React.FC<SimulationModalProps> = ({ signal, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // This effect ensures the video tries to play as soon as the component loads.
  useEffect(() => {
    videoRef.current?.play().catch(error => {
      // Autoplay can sometimes be blocked by the browser, this catches the error.
      console.error("Video autoplay failed:", error);
    });
  }, []);

  return (
    // The Modal Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000]"
      onClick={onClose} // Close the modal if the user clicks the background
    >
      {/* The Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{signal.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
          >
            &times;
          </button>
        </div>
        
        {/* The Video Player */}
        <div className="rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={signal.videoUrl}
            width="100%"
            loop
            muted
            playsInline
            controls={false}
          ></video>
        </div>
      </div>
    </div>
  );
};

export default SimulationModal;
