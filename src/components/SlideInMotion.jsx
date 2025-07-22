
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function SlideInMotion({ children }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0 });
    } else {
      controls.start({ opacity: 0, x: -100 });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -100 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-4 bg-cyan-900 text-white rounded-md"
    >
      {children}
    </motion.div>
  );
}





// import { motion } from "framer-motion";

// export default function SlideInMotion({ children }) {
//   return (
//     <motion.div
//       initial={{ x: -100, opacity: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       whileInView={{ x: 0, opacity: 1 }}
//       viewport={{ once: false, amount: 0.5 }}
//     >
//       {children}
//     </motion.div>
//   );
// }
