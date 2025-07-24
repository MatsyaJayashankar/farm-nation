import React, { useRef, useEffect, useState } from "react";

const NUM_PARTICLES = 7;
const GROUP_SIZE = 3;
const MAX_RADIUS = 2.1;
const SPREAD_X = 20;
const SPREAD_Y = 60;

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}

export default function FlowingParticlesSnake() {
  const pathRef = useRef<SVGPathElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [time, setTime] = useState(0);
  const [particles, setParticles] = useState<number[]>([]);
  const { width, height } = useWindowSize();

  useEffect(() => {
    setParticles(Array.from({ length: NUM_PARTICLES }, (_, i) => i * 14));
  }, []);

  useEffect(() => {
    const updateScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    let frame: number;
    const loop = () => {
      setTime((prev) => prev + 0.02);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const generateSnakePath = () => {
    const segments = 5;
    const spacingY = 150;
    const baseX = width / 2;
    const points: [number, number][] = [];

    for (let i = 0; i <= segments; i++) {
      const wave = Math.sin(scrollY * 0.008 + i * 0.6) * 270;
      points.push([baseX + wave, i * spacingY]);
    }

    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      path += ` Q ${x1} ${y1}, ${(x1 + x2) / 2} ${(y1 + y2) / 2}`;
    }

    return path;
  };

  return (
    <svg
      className="fixed -top-10 left- w-full h-full pointer-events-none z-50"
      viewBox={`0 0 ${1000} ${500}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="blur-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={generateSnakePath()}
        stroke="#ffffff"
        strokeWidth="4"
        fill=""
        filter="url(#blur-glow)"
      />

      {pathRef.current &&
        particles.map((offset, i) => {
          const length = pathRef.current.getTotalLength();
          const progress = (scrollY * 0.3 + offset + time * 40) % length;
          const basePoint = pathRef.current.getPointAtLength(progress);

          return Array.from({ length: GROUP_SIZE }, (_, j) => {
            const driftX = Math.sin(time * 0.5 + i + j) * SPREAD_X;
            const driftY = Math.cos(time * 0.3 + j * 2) * SPREAD_Y;
            const radius =
              1.5 + Math.abs(Math.sin(time + j * 0.5 + i)) * MAX_RADIUS;

            return (
              <circle
                className="hover-10"
                key={`${i}-${j}`}
                cx={basePoint.x + driftX}
                cy={basePoint.y + driftY}
                r={radius}
                fill="#ffffff"
                opacity={0.5 + (j % 2) * 0.3}
              />
            );
          });
        })}
    </svg>
  );
}

// import React, { useRef, useEffect, useState } from "react";

// const NUM_PARTICLES = 80;

// function useWindowSize() {
//   const [size, setSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });
//   useEffect(() => {
//     const handleResize = () =>
//       setSize({ width: window.innerWidth, height: window.innerHeight });
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return size;
// }

// export default function ScrollSnakeWithParticles() {
//   const pathRef = useRef<SVGPathElement>(null);
//   const [scrollY, setScrollY] = useState(0);
//   const [particles, setParticles] = useState<number[]>([]);
//   const { width, height } = useWindowSize();

//   useEffect(() => {
//     const updateScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", updateScroll);
//     return () => window.removeEventListener("scroll", updateScroll);
//   }, []);

//   useEffect(() => {
//     setParticles(Array.from({ length: NUM_PARTICLES }, (_, i) => i * 10));
//   }, []);

//   const generateBezierPath = () => {
//     const segments = 8;
//     const spacingY = 160;
//     const baseX = width / 2;
//     const points: [number, number][] = [];

//     for (let i = 0; i <= segments; i++) {
//       const wave = Math.sin(scrollY * 0.008 + i * 0.6) * 80;
//       const x = baseX + wave;
//       const y = i * spacingY;
//       points.push([x, y]);
//     }

//     let path = `M ${points[0][0]} ${points[0][1]}`;
//     for (let i = 1; i < points.length - 1; i++) {
//       const [x1, y1] = points[i];
//       const [x2, y2] = points[i + 1];
//       const cx = (x1 + x2) / 2;
//       const cy = (y1 + y2) / 2;
//       path += ` Q ${x1} ${y1}, ${cx} ${cy}`;
//     }

//     return path;
//   };

//   return (
//     <svg
//       className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
//       viewBox={`0 0 ${1000} ${height}`}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <linearGradient id="snake-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%" stopColor="#d0d0d0" />
//           <stop offset="50%" stopColor="#ffffff" />
//           <stop offset="100%" stopColor="#d0d0d0" />
//         </linearGradient>
//         <filter id="glow">
//           <feGaussianBlur stdDeviation="3" result="blur" />
//           <feMerge>
//             <feMergeNode in="blur" />
//             <feMergeNode in="SourceGraphic" />
//           </feMerge>
//         </filter>
//       </defs>

//       <path
//         ref={pathRef}
//         d={generateBezierPath()}
//         //stroke="url(#snake-gradient)"
//         strokeWidth="400"
//         fill="none"
//         filter="url(#)"
//       />

//       {pathRef.current &&
//         particles.map((offset, i) => {
//           const pathLength = pathRef.current?.getTotalLength() || 0;
//           const scrollY = window.scrollY + offset;
//           const progress = (scrollY * 0.2 + i * 15) % pathLength;
//           const { x, y } = pathRef.current?.getPointAtLength(progress) || {
//             x: 0,
//             y: 0,
//           };
//           return (
//             <circle
//               key={i}
//               cx={x}
//               cy={y}
//               r={1.5 + (i % 3)}
//               fill="#ffffff"
//               opacity={0.6}
//             />
//           );
//         })}
//     </svg>
//   );
// }
