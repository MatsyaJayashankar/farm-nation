import { useRef, useEffect } from "react";

const ElectricMouseTrail = () => {
  const canvasRef = useRef(null);
  const points = useRef([]);
  const lastMoveTime = useRef(Date.now());
  const duration = 100; // Trail duration in milliseconds
  const idleTimeout = 100; // Time until trail disappears when mouse stops

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);

    function drawTrail() {
      const now = Date.now();
      const idleTime = now - lastMoveTime.current;

      // Wipe canvas and points if idle
      if (idleTime > idleTimeout) {
        points.current = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawTrail);
        return;
      }

      const recentPoints = points.current.filter(
        (pt) => now - pt.timestamp < duration
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (recentPoints.length > 2) {
        ctx.beginPath();
        ctx.moveTo(recentPoints[0].x, recentPoints[0].y);

        for (let i = 1; i < recentPoints.length - 2; i++) {
          const xc = (recentPoints[i].x + recentPoints[i + 1].x) / 2;
          const yc = (recentPoints[i].y + recentPoints[i + 1].y) / 2;
          ctx.quadraticCurveTo(recentPoints[i].x, recentPoints[i].y, xc, yc);
        }

        ctx.strokeStyle = "rgba(0, 255, 255, 0.8)";
        ctx.lineWidth = 1;
        ctx.shadowColor = "cyan";
        ctx.shadowBlur = 15;
        ctx.stroke();
      }

      requestAnimationFrame(drawTrail);
    }

    const handleMouseMove = (e) => {
      lastMoveTime.current = Date.now();

      points.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      if (points.current.length > 100) points.current.shift();
    };

    drawTrail();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default ElectricMouseTrail;
