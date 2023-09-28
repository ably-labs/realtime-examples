import type { LockStatus, Space, Lock } from "@ably/spaces";
import { useEffect, useState } from "react";

import { type Member } from "../utils/types";

export const useLock = (space: Space, lockId: string) => {
  const [status, setStatus] = useState<LockStatus | null>(null);
  const [lockHolder, setLockHolder] = useState<Member | null>(null);

  const initialized = status !== null;

  useEffect(() => {
    if (!space) return;

    const handler = (lock: Lock) => {
      if (lock.id !== lockId) return;

      if (lock.status === "unlocked") {
        setStatus(null);
        setLockHolder(null);
      } else {
        setStatus(lock.status);
        setLockHolder(lock.member as Member);
      }
    };

    /** 💡 Listen to all lock events 💡 */
    space.locks.subscribe("update", handler);

    return () => {
      /** 💡 Remove listener on unmount 💡 */
      space?.locks.unsubscribe("update", handler);
    };
  }, [space, lockId]);

  /** 💡 Set initial status of lock 💡 */
  useEffect(() => {
    if (initialized || !space) return;

    const lock = space.locks.get(lockId);

    if (lock) {
      setLockHolder(lock.member as Member);
      setStatus(lock.status);
    }
  }, [initialized, space]);

  return { status, lockHolder };
};
