import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const TypewriterHeading = ({
  text = "FARM NATION",
  speed = 30,
  heading = "h1",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const lastTimeRef = useRef(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true }); // only triggers once

  useEffect(() => {
    if (!inView || isTyping) return;

    setIsTyping(true);

    const step = (timestamp) => {
      if (timestamp - lastTimeRef.current >= speed) {
        const nextChar = text.charAt(indexRef.current);
        if (nextChar) {
          setDisplayedText((prev) => prev + nextChar);
          indexRef.current += 1;
          lastTimeRef.current = timestamp;
        }
      }
      if (indexRef.current < text.length) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [inView, isTyping, text, speed]);

  const MotionTag = motion[heading];

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 1 }}
      style={{
        //fontFamily: 'monospace',
        whiteSpace: "normal",
        display: "inline-block",
        position: "relative",
      }}
    >
      {displayedText}
      <span
        style={{
          display: "inline-block",
          width: "1ch",
          animation: isTyping ? "blink 1s step-end infinite" : "none",
        }}
      >
        /
      </span>
      <style>
        {`
          @keyframes blink {
            0%   { opacity: 1; }
            50%  { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </MotionTag>
  );
};

export default TypewriterHeading;
