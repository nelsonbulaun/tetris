import "./home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>

      <div className="homeContainer">
        <div className="logoName">Tetris</div>
        <div className="buttonContainer">
        <Link to={"/tetris/survival"}>
          <button>Survival Mode</button>
        </Link>
        <Link to={"/tetris/fortyLines"}>
          <button>Forty Lines</button>
        </Link>
      </div>
      </div>
    </>
  );
};

export default Home;
