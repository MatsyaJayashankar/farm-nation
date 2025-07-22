const styles = {
  container: `grid gap-30 place-items-center w-full md:w-screen`,

  card: `snap-start //sticky top-[100px] relative group w-full h-[300px] overflow-hidden cursor-pointer
         grid grid-cols-1 place-items-center 
         md:w-1/2 md:grid-cols-2 md:gap-5`,

  overlay: `${inView ? "h-[50%] bg-cyan-950 md:w-1/2 md:translate-x-1/2" : ""}
            bg-black h-full w-full absolute opacity-70
            grid place-items-center transition-all duration-350`,

  text: `${inView ? "opacity-100" : "opacity-0"} 
         transition-opacity duration-1400`,

  title: `${inView || isSelected === index ? "opacity-0" : ""} 
          absolute transition duration-1000
          w-1/2 md:-translate-x-1/2`,

  image: `w-full h-full object-cover group-hover:shadow-[14px_14px_14px_black]`,

  button: `absolute bottom-0 right-0 scale-70 text-white font-bold rounded-full 
           transition-all duration-300 ease-in-out transform 
           active:shadow-[0_0_14px_cyan] group-hover:hidden`,

  cartBtn: `${inView ? "inline mt-10" : "hidden"}
            absolute bottom-10 right-0 scale-70 text-white font-bold rounded-full outline outline-green-500
            transition-all duration-1400 ease-in-out transform 
            active:shadow-[0_0_14px_cyan]`,
};
