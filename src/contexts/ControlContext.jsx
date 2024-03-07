import { createContext, useContext, useState, useEffect } from "react";

const ControlContext = createContext({
  leftKey: [],
  setLeftKey: () => {},
  rightKey: [],
  setRightKey: () => {},
  upKey: [],
  setUpKey: () => {},
  downKey: [],
  setDownKey: () => {},
  reassigningDirection: [],
  setReassigningDirection: () => {},
});

export const useControlContext = () => useContext(ControlContext);

const ControlProvider = ({ children }) => {
  const [leftKey, setLeftKey] = useState("ArrowLeft");
  const [rightKey, setRightKey] = useState("ArrowRight");
  const [upKey, setUpKey] = useState("ArrowUp");
  const [downKey, setDownKey] = useState("ArrowDown");
  const [reassigningDirection, setReassigningDirection] = useState(null);

  useEffect(() => {
    const handleKeyReassignment = (event) => {
      if (reassigningDirection) {
        switch (reassigningDirection) {
          case "left":
            setLeftKey(event.key);
            break;
          case "right":
            setRightKey(event.key);
            break;
          case "up":
            setUpKey(event.key);
            break;
          case "down":
            setDownKey(event.key);
            break;
          default:
            break;
        }
        setReassigningDirection(null); // Reset reassigning direction
      }
    };

    document.addEventListener("keydown", handleKeyReassignment);

    return () => {
      document.removeEventListener("keydown", handleKeyReassignment);
    };
  }, [reassigningDirection]);

  return (
    <ControlContext.Provider
      value={{ leftKey, rightKey, upKey, downKey, reassigningDirection, setReassigningDirection }}
    >
      {children}
    </ControlContext.Provider>
  );
};

export default ControlProvider;
