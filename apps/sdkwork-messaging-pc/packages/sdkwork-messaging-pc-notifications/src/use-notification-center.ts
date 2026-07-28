import type {
  MessagingNotificationListResponse,
  NotificationCenterService,
} from "@sdkwork/messaging-pc-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { resolveNotificationCenterError, type NotificationCenterErrorKind } from "./notification-types.ts";

export type NotificationCenterLoadState =
  | { status: "loading" }
  | { status: "ready"; value: MessagingNotificationListResponse }
  | { status: "error"; kind: NotificationCenterErrorKind };

const PAGE_SIZE = 20;

export function useNotificationCenter(service: NotificationCenterService) {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [loadState, setLoadState] = useState<NotificationCenterLoadState>({ status: "loading" });
  const [markingId, setMarkingId] = useState<string>();
  const requestSequence = useRef(0);

  useEffect(() => {
    const requestId = ++requestSequence.current;
    setLoadState({ status: "loading" });
    void service.listNotifications({ page, pageSize: PAGE_SIZE })
      .then((value) => {
        if (requestSequence.current === requestId) setLoadState({ status: "ready", value });
      })
      .catch((error: unknown) => {
        if (requestSequence.current === requestId) {
          setLoadState({ status: "error", kind: resolveNotificationCenterError(error) });
        }
      });
  }, [attempt, page, service]);

  const refresh = useCallback(() => setAttempt((current) => current + 1), []);

  const markRead = useCallback(async (notificationId: string) => {
    setMarkingId(notificationId);
    try {
      await service.markRead(notificationId);
      setLoadState((current) => current.status !== "ready"
        ? current
        : {
            status: "ready",
            value: {
              ...current.value,
              items: current.value.items.map((item) => item.id === notificationId
                ? { ...item, status: "read", readAt: item.readAt ?? new Date().toISOString() }
                : item),
            },
          });
    } finally {
      setMarkingId(undefined);
    }
  }, [service]);

  return { loadState, markRead, markingId, page, refresh, setPage };
}

