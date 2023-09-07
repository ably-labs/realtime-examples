import type { LockStatus, Space, Lock } from "@ably/spaces";
import { useEffect, useState } from "react";

import { type Member } from "./utils/helper";

export const useLock = (space: Space, lockId: string) => {
  const [status, setStatus] = useState<LockStatus | null>(null);
  const [lockHolder, setLockHolder] = useState<Member | null>(null);

  const initialized = status !== null;

  useEffect(() => {
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

    space.locks.subscribe("update", handler);

    return () => {
      space.locks.unsubscribe("update", handler);
    };
  }, [space, lockId]);

  useEffect(() => {
    if (initialized) return;
    const lock = space.locks.get(lockId);
    if (lock) {
      setLockHolder(lock.member as Member);
      setStatus(lock.status);
    }
  }, [initialized, space]);

  return { status, lockHolder };
};
