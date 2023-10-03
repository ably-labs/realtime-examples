import * as React from "react";
import Spaces, { type Space } from "@ably/spaces";
import { useAbly } from "ably/react";

import { getSpaceNameFromUrl } from "../utils/helpers";

const SpacesContext = React.createContext<Space | undefined>(undefined);

const SpaceContextProvider: React.FC<{
  example: string;
  children: React.ReactNode;
}> = ({ example, children }) => {
  const [space, setSpace] = React.useState<Space | undefined>(undefined);
  const client = useAbly();

  const spaces = React.useMemo(() => {
    return new Spaces(client);
  }, [example]);

  React.useEffect(() => {
    let ignore: boolean = false;
    const spaceName = getSpaceNameFromUrl();

    const init = async () => {
      const spaceInstance = await spaces.get(spaceName, {
        offlineTimeout: 10_000,
      });

      if (spaceInstance && !space && !ignore) {
        setSpace(spaceInstance);
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, [spaces]);

  return (
    <SpacesContext.Provider value={space}>{children}</SpacesContext.Provider>
  );
};

export { SpaceContextProvider, SpacesContext };
