import { useEffect } from "react";
import { useSpace } from "@ably/spaces/react";
import { getLocationColors } from "../utils/mockColors";
import { getMemberName } from "../utils/mockNames";
import Form from "./Form";

import styles from "./ComponentLocking.module.css";

const ComponentLocking = () => {
  /** 💡 Get a handle on a space instance 💡 */
  const { space } = useSpace();

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    space?.enter({
      memberName: getMemberName(),
      memberColor: getLocationColors(),
    });
  }, [space]);

  return (
    <div
      id="component-locking"
      className={`example-container ${styles.container}`}
    >
      <div className={styles.inner}>
        <Form />
      </div>
    </div>
  );
};

export default ComponentLocking;
