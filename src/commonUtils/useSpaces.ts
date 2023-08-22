import { useContext } from "react";

import { useEffect } from "react";
import { SpacesContext } from "../components/SpacesContext";

const useSpaces = (_spaceName: string, userData: {}) => {
  const space = useContext(SpacesContext);

  useEffect(() => {
    space?.enter({ ...userData });

    return () => {
      space?.leave();
    };
  }, [space]);

  return space;
};

export default useSpaces;
