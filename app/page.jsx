"use client";

import { AiFillGithub } from "react-icons/ai";
import RealtimeDetection from "../components/realtimedetection";
import { useEffect, useState } from "react";

function App() {
  const [camera, setCamera] = useState(true);
  const [notice, setNotice] = useState(true);
  const [gestureInfo, setGestureInfo] = useState(
    "**Click to get a description of each symbol**"
  );

  useEffect(() => {
    navigator.permissions.query({ name: "camera" }).then(function (result) {
      if (!(result.state === "granted")) {
        setCamera(false);
      }
    });
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-3xl m-5">Sign Language Translator</h1>
      <p>
        I have used transfer learning on a pre trained object detection model to
        recognize the following 5 gestures.
      </p>
      <div className="flex flex-row justify-center lg:text-7xl text-5xl m-5">
        <button
          className="shadow-2xl bg-neutral-800 hover:bg-neutral-900 rounded-lg"
          onClick={() => setGestureInfo("Yes: Make a fist.")}
        >
          👊
        </button>
        <button
          className="shadow-2xl bg-neutral-800 hover:bg-neutral-900 rounded-lg"
          onClick={() => setGestureInfo("I Love You")}
        >
          🤟
        </button>
        <button
          className="shadow-2xl bg-neutral-800 hover:bg-neutral-900 rounded-lg"
          onClick={() => setGestureInfo("Hello: Hold a steady hand.")}
        >
          👋
        </button>
        <button
          className="shadow-2xl bg-neutral-800 hover:bg-neutral-900 rounded-lg"
          onClick={() =>
            setGestureInfo("No: Pinch your hand but leave a little gap.")
          }
        >
          🤏
        </button>
        <button
          className="shadow-2xl bg-neutral-800 hover:bg-neutral-900 rounded-lg flex flex-row"
          onClick={() =>
            setGestureInfo(
              "Thank You: Hold Both hands close to your chin. Palms facing towards you."
            )
          }
        >
          <div className="-mr-2">🤚</div>
          <div className="scale-x-[-1] -ml-2">🤚</div>
        </button>
      </div>
      <p className="text-xs -mt-2">{gestureInfo}</p>
      <div className="flex flex-col items-center">
        {notice && (
          <button
            className="max-w-md mt-2 text-sm w-full text-neutral-800 bg-neutral-200 shadow-md rounded-lg p-2 flex flex-col justify-normal items-center gap-y-3 transition"
            onClick={() => {
              setNotice(false);
            }}
          >
            <p>
              Depending on your internet connection and your computer
              specifications, the demo might be slow.
            </p>
            <p>
              Try enabling hardware acceleration on browser or installing to
              your device (PWA).
            </p>
            <p className="text-xs hover:text-neutral-400">*Touch to close*</p>
          </button>
        )}
        {!camera ? (
          <button
            className="rounded my-5 mx-auto border bg-neutral-200 text-neutral-800 p-1"
            onClick={() => {
              setCamera(true);
            }}
          >
            Please allow permission to camera
          </button>
        ) : (
          <RealtimeDetection />
        )}
        <a
          href="https://github.com/Kushal-Chandar/Sign-Language-Translator"
          target="_blank"
        >
          <AiFillGithub
            size={30}
            className="mx-auto mt-2 hover:text-black transition"
          />
        </a>
      </div>
    </div>
  );
}

export default App;
