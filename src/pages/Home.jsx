import { div } from "framer-motion/client";
import TopProducts from "../components/TopProducts";
import TypewriterHeading from "../components/TypeWriter";
import { useFarmStore } from "../stores/useFarmStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";

const Home = () => {
  const imageUrl = [
    "https://www.tokyoweekender.com/wp-content/uploads/2019/03/Bungotakada_tashibu-no-sho-feature.jpg",
  ];
  const { topProducts } = useFarmStore();
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) console.log(user?.id);
  }, [user]);
  return (
    <>
      <div
        className="w-screen h-screen fixed top-0 left-0
      bg-cover bg-center bg-no-repeat opacity-49"
        style={{ backgroundImage: `url(${imageUrl[0]})` }}
      >
      </div>
    </>
  );
};
export default Home;
