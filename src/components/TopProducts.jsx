import { useEffect, useRef, useState } from "react";
import Loader from "../components/ReactSpinner";
import { useFarmStore } from "../stores/useFarmStore";
import TypewriterHeading from "../components/TypeWriter";
import { motion, useScroll, useTransform } from "framer-motion";

const TopProducts = ({ onHome }) => {
  const { fetchProducts, topProducts, loading, error } = useFarmStore();

  //const testArray = Array.from({ length: 100 }, (_, i) => i + 1);

  const [selected, setSelected] = useState(-1);
  //SCROLL Y to X
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });
  const xShift = useTransform(scrollYProgress, [0, 1], ["250%", "-500%"]);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  //box with info -name,price,desc, cart button
  // right - image
  return (
    <>
      <TypewriterHeading text="Top Products" />
      <div
        className={`transition-all duration-700 
        flex flex-col mx-w-screen-lg 

        ${onHome ? "w-full flex-row  items-center gap-5" : ""} `}
      >
        {topProducts.map((item, idx) => (
          // STICKY
          <div
            role="button"
            className={`group pt-[80px] h-70 sticky top-25 bottom-100 cursor-pointer
            flex flex-col gap-4
          transition-all duration-700 ease-in-out hover:opacity-100
          ${selected === idx ? "w-80" : "w-full"}`}
            onClick={() => setSelected(idx)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded shadow hover:shadow-[0_0_14px_black]  hover:opacity-100"
            />
            <div className="group h-70 w-full absolute opacity-50 hover:opacity-0 bg-black "></div>
              <p
                className={`transition-all duration-350 px-5
                group-hover:bg-black relative top-50 transition-all duration-700 ease-in-out 
                
                ${selected === idx ? "md:w-80" : "md:hidden"}`}
              >
                <TypewriterHeading
                  text={item.description}
                  heading="p"
                  speed="20"
                />
              </p>
          </div>
        ))}
      </div>

      <TypewriterHeading text={"Cart"} />

      <div
        ref={scrollRef}
        className=" static -top-100 z-50 top-50 flex-row gap-1 bg-white  w-50 md:w-full overflow-auto h20 p-20"
      >
        <motion.div style={{ x: xShift }} className="flex gap-10">
          {/* {testArray.map((i) => (
            <div className="bg-red-500 w-50 h-10">{i}</div>
          ))} */}
          {/* {products2.map((item) => (
            <>
              <img src={item.image} className="w-20 h-20 object-cover" />
              <p></p>
            </>
          ))} */}
        </motion.div>
      </div>
    </>
  );
};
export default TopProducts;
