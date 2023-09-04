import type { LockStatus, Space, SpaceMember, Lock } from "@ably/spaces";
import { useEffect, useState } from "react";

export const useLock = (space: Space, lockId: string) => {
  const [status, setStatus] = useState<LockStatus | null>(null);
  const [lockHolder, setLockHolder] = useState<SpaceMember | null>(null);

  const initialized = status !== null;

  useEffect(() => {
    const handler = (lock: Lock) => {
      if (lock.id !== lockId) return;
      if (lock.status === "unlocked") {
        setStatus(null);
        setLockHolder(null);
      } else {
        setStatus(lock.status);
        setLockHolder(lock.member);
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
      setLockHolder(lock.member);
      setStatus(lock.status);
    }
  }, [initialized, space]);

  return { status, lockHolder };
};
