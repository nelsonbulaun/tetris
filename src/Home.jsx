import "./home.css";
import { Link } from "react-router-dom";
import mainMenuAudio from "./assets/audio/MainThemeMenuInFlightTetris.mp3";
import buttonSoundEffect from "./assets/audio/se_game_pause.wav";
const buttonSE = new Audio(buttonSoundEffect);
const mainMenuSong = new Audio(mainMenuAudio);

import { useState } from "react";

export const Home = () => {
  const [volume, setVolume] = useState(0.5);
  const [menuMusic, setMenuMusic] = useState(false);
  mainMenuSong.volume = volume;
  buttonSE.volume = volume;

  function playMenuMusic() {
    if (menuMusic){
      setMenuMusic(false);
      mainMenuSong.pause();
    } else {mainMenuSong.play();
    setMenuMusic(true);}

  }
  function handleClick() {
    buttonSE.play();
    mainMenuSong.pause();
  }


  return (
    <>
      <div className="homeContainer">
        <div className="logoName">Tetris</div>
        <div className="buttonContainer">
          <Link to={"/tetris/survival"}>
            <button onClick={handleClick}>Survival Mode</button>
          </Link>
          <Link to={"/tetris/fortyLines"}>
            <button onClick={handleClick}>Forty Lines</button>
          </Link>
          </div>
      <div className="titleMusic"> 
      <button onClick={playMenuMusic}>Music</button>
        {menuMusic ? <input
  
          type="range"
          label="Music Volume:"
          min={0}
          max={1}
          step={0.02}
          value={volume}
          onChange={(event) => {
            setVolume(event.target.valueAsNumber);
          }}
        />: <></>}</div>

      </div>
    </>
  );
};

export default Home;
