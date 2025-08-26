import React, { useEffect, useState } from "react";
import "./PipelineLoader.css";

const steps = [
  "📡 Retrieving ",
  "🧠 Analyzing ",
  "🤖 Processing "
];

const PipelineLoader = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setStepIndex(stepIndex + 1);
      }, 5000); // show each step for 2s
      return () => clearTimeout(timer);
    }
  }, [stepIndex]);

  return (
    <div className="pipeline-loader">
      
      {/* <div className="flow"></div> */}
      <div className="typing-indicator">
        <span className="label fade">{steps[stepIndex]}</span>
      <span className="dot"></span><span className="dot"></span><span className="dot"></span>
    </div>
    </div>
  );
};

export default PipelineLoader;
