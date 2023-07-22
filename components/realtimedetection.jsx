"use client";

import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

const labelMap = {
  1: { name: "Hello", color: "red" },
  2: { name: "Yes", color: "blue" },
  3: { name: "No", color: "purple" },
  4: { name: "Thank You", color: "yellow" },
  5: { name: "I Love You", color: "lime" },
};

export const drawRect = (
  boxes,
  classes,
  scores,
  threshold,
  imgWidth,
  imgHeight,
  ctx
) => {
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      const [y, x, height, width] = boxes[i];
      const text = classes[i];

      ctx.strokeStyle = labelMap[text]["color"];
      ctx.lineWidth = 5;
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";

      ctx.rect(
        x * imgWidth,
        y * imgHeight,
        (width * imgWidth) / 2,
        (height * imgHeight) / 1.5
      );
      ctx.stroke();
      ctx.scale(-1, 1);
      ctx.fillText(
        labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
        -(x * imgWidth) - (width * imgHeight) / 1.5,
        y * imgHeight - 10
      );
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
};

function RealtimeDetection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runCoco = async () => {
      const net = await tf.loadGraphModel("/model/model.json");
      setInterval(() => {
        detect(net);
      }, 30);
    };
    runCoco();
  }, []);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();

      const ctx = canvasRef.current.getContext("2d");

      requestAnimationFrame(() => {
        drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.8,
          videoWidth,
          videoHeight,
          ctx
        );
      });

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };
  return (
    <div className="max-w-[640px] max-h-[480px] w-full h-full my-10 scale-x-[-1]">
      <Webcam
        className="absolute border rounded-lg mx-auto left-0 right-0 z-10 h-fit w-full"
        ref={webcamRef}
        alt="Camera is Disabled"
      />
      <canvas
        ref={canvasRef}
        className="relative border rounded-lg mx-auto left-0 right-0 z-20 h-fit w-full"
      />
    </div>
  );
}

export default RealtimeDetection;
