const styles = {
  overlay: `${
    inView && !onCart ? "h-[50%] bg-cyan-950 md:w-1/2 md:translate-x-1/2" : ""
  }
            bg-black h-full w-full absolute opacity-70
            grid place-items-center transition-all duration-350`,

  text: `${
    inView && !onCart
      ? "md:opacity-100 opacity-0 group-hover:opacity-100"
      : "opacity-0"
  }
         transition-opacity duration-1400`,

  title: `${inView || isSelected ? "opacity-0" : ""}
          absolute transition duration-1000
          w-1/2 md:-translate-x-1/2`,

  image: `w-full h-full object-cover group-hover:shadow-[14px_14px_14px_black]`,

  cartBtn: `${inView ? "inline mt-10" : "hidden"} group-hover:inline
            absolute bottom-0 right-0 scale-70 text-white font-bold rounded-full outline outline-green-500
            transition-all duration-1400 ease-in-out transform 
            active:shadow-[0_0_14px_cyan]`,

  details: `absolute md:w-1/2 left-0 bg-black opacity-70 space-y-2 text-left transition-all duration-1400 ease-in-out`,
};
