
export const Footer = () => {
  return (
    <footer>
      <div className="FF">
        <audio id="audio-player" src="" preload="auto" />
        <a className="AudioB" id="replay">
          <i id="replay" className="fas fa-step-backward" />
        </a>
        <a className="AudioB" id="playpause"  style={{display: "none"}}>
          <i id="play" className="fas fa-play" />
          <i id="pause" className="fas fa-pause" style={{display: "none"}} />
        </a>
        <div className="AudioT" id="timeText">
          <span id="currentTime">00:00</span>
          /
          <span id="maxTime">00:00</span>
        </div>
        <input className="audioS" id="audio-seekbar" type="range" name="time" min="0" max="100" step="0.01" value="0" />
        <input className="audioS" id="audio-speed" type="range" name="speed" min="0.5" max="2" step="0.01" value="1" />
        <input className="AudioPT" id="pitch" type="number" name="pitch" min="0.5" max="2" step="0.01" value="1" />
        <input className="audioS" id="audio-volume" type="range" name="volume" min="-1" max="0" step="0.01" value="0" />
      </div>
    </footer>
  );
};