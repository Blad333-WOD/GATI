// This component displays a video that autoplays without controls.
// It's designed to be used inside the map's popup.

interface SimulationPlayerProps {
  videoSrc: string; // The path to the video file, e.g., "/test simulation.mp4"
}

const SimulationPlayer: React.FC<SimulationPlayerProps> = ({ videoSrc }) => {
  return (
    <div className="mt-2 rounded-md overflow-hidden">
      <video
        src={videoSrc}
        width="100%"
        // These properties are key for the requested behavior:
        autoPlay      // Starts the video automatically.
        loop          // Replays the video when it ends.
        muted         // Mutes the audio (required for autoplay in most browsers).
        playsInline   // Prevents the video from going fullscreen on mobile.
        controls={false} // Hides the default play/pause/seek controls.
      />
    </div>
  );
};

export default SimulationPlayer;
