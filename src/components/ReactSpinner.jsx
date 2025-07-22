import { ScaleLoader } from "react-spinners";
import TypewriterHeading from "./TypeWriter";

const Loader = ({text, speed, heading}) => {
  return (
    <>
      <TypewriterHeading text={text} speed={150} />

      <ScaleLoader color="#9ACD32" loading={true} size={100} />
    </>
  );
};
export default Loader;
