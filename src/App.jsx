import { useState } from "react";
import "./App.css";
import blobs from "./resources/blobs.png";
import blobs5 from "./resources/blob5.png";
import Quiz from "./Quiz.jsx";
import { nanoid } from "nanoid";

function App() {
  const [start, setStart] = useState(false);
  const uniqueId = nanoid();
  return (
    <div className="svg">
      <img className="top-right" src={blobs} />
      <img className="bottom-left" src={blobs5} />
      {!start ? (
        <div className="start">
          <h1>Quizzical</h1>
          <p>Some description id needed</p>
          <button onClick={() => setStart((prv) => !prv)}>Start quiz</button>
        </div>
      ) : (
        <Quiz key={uniqueId} />
      )}
    </div>
  );
}

export default App;
