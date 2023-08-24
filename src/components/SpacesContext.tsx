import * as React from "react";
import Spaces, { type Space } from "@ably-labs/spaces";
import { Realtime } from "ably";
import createApiConfig from "../commonUtils/apiConfig";

export const SpacesContext = React.createContext<Space | undefined>(undefined);

const SpaceContextProvider: React.FC<{
  example: string;
  spaceName: string;
  children: React.ReactNode;
}> = ({ example, spaceName, children }) => {
  const [space, setSpace] = React.useState<Space | undefined>(undefined);

  const spaces = React.useMemo(() => {
    const ably = new Realtime.Promise(createApiConfig(example));
    // @ts-ignore
    return new Spaces(ably);
  }, [example]);

  React.useEffect(() => {
    let ignore: boolean = false;

    const init = async () => {
      if (ignore) {
        return;
      }

      const spaceInstance = await spaces.get(spaceName, {
        offlineTimeout: 10_000,
      });

      if (spaceInstance && !space) {
        setSpace(spaceInstance);
      }
    };

    init();

    return () => {
      ignore = true;
    };
  });

  return (
    <SpacesContext.Provider value={space}>{children}</SpacesContext.Provider>
  );
};

export { SpaceContextProvider };
