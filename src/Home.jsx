import "./home.css";
import { Link } from "react-router-dom";
import buttonSoundEffect from "./assets/se_game_pause.wav";
const buttonSE = new Audio(buttonSoundEffect);

export const Home = () => {


  return (
    <>

      <div className="homeContainer">
        <div className="logoName">Tetris</div>
        <div className="buttonContainer">
        <Link to={"/tetris/survival"}>
          <button onClick={buttonSE.play()}>Survival Mode</button>
        </Link>
        <Link to={"/tetris/fortyLines"}>
          <button onClick={buttonSE.play()}>Forty Lines</button>
        </Link>
      </div>
      </div>
    </>
  );
};

export default Home;
