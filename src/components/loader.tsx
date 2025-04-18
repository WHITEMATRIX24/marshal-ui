"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-10 h-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <circle
            fill="#000000"
            stroke="#000000"
            strokeWidth={5}
            r={15}
            cx={40}
            cy={100}
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur={2}
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin={-0.4}
            />
          </circle>
          <circle
            fill="#000000"
            stroke="#000000"
            strokeWidth={5}
            r={15}
            cx={100}
            cy={100}
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur={2}
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin={-0.2}
            />
          </circle>
          <circle
            fill="#000000"
            stroke="#000000"
            strokeWidth={5}
            r={15}
            cx={160}
            cy={100}
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur={2}
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin={0}
            />
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
