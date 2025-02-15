import { Key, RefObject, useEffect, useMemo, useRef, useState } from 'react';

import {
  JengaNotificationsApi,
  JengaNotificationsApiNotifyCallback,
  JengaNotifyApiProps,
  JengaNotifyApiPropsWithID,
} from '../types';
import { useEvent } from '@jengaui/hooks';

const DISMISS_EVENT_NAME = 'jenga:notification:dismiss';
type DismissEvent = CustomEvent<JengaNotifyApiPropsWithID>;

export function useNotifications(
  rootRef: RefObject<HTMLElement | null> | null,
) {
  const idPrefix = useMemo(() => new Date().getTime(), []);
  const idRef = useRef(0);
  const listeners = useRef<(() => void)[]>([]);
  const [notifications, setNotifications] = useState<
    Map<Key, JengaNotifyApiPropsWithID>
  >(new Map());

  const addToast: JengaNotificationsApi['notify'] = Object.assign(
    useEvent<JengaNotificationsApiNotifyCallback>((props) => {
      const nextID = idRef.current++;
      const {
        id = `${idPrefix}_${nextID}`,
        duration,
        isDismissible = true,
        ...rest
      } = props;

      setNotifications((toasts) => {
        const newToasts = new Map(toasts);
        newToasts.set(id, {
          id,
          isDismissible,
          duration: duration ?? (isDismissible ? 5_000 : null),
          ...rest,
        } as JengaNotifyApiPropsWithID);

        return newToasts;
      });

      return {
        id,
        remove: () => removeToast(id),
        update: (props) => updateToast(id, props),
      };
    }),
    {
      success: (props: JengaNotifyApiProps) =>
        addToast({ type: 'success', ...props }),
      danger: (props: JengaNotifyApiProps) =>
        addToast({ type: 'danger', ...props }),
      attention: (props: JengaNotifyApiProps) =>
        addToast({ type: 'attention', ...props }),
    },
  );

  const updateToast = useEvent<JengaNotificationsApi['update']>((id, props) => {
    setNotifications((toasts) => {
      const currentToast = toasts.get(id);

      if (currentToast) {
        const newToasts = new Map(toasts);
        newToasts.set(id, {
          ...currentToast,
          ...props,
        } as JengaNotifyApiPropsWithID);

        return newToasts;
      }

      return toasts;
    });
  });

  const removeToast = useEvent<JengaNotificationsApi['remove']>((id) => {
    setNotifications((toasts) => {
      if (toasts.has(id)) {
        const newToasts = new Map(toasts);
        newToasts.delete(id);

        return newToasts;
      }

      return toasts;
    });
  });

  const onDismissNotification = useEvent((id: Key) => {
    const toast = notifications.get(id);

    if (toast?.putNotificationInDropdownOnDismiss !== false) {
      rootRef?.current?.dispatchEvent(
        new CustomEvent(DISMISS_EVENT_NAME, { detail: toast }),
      );
    }
  });

  const addOnDismissListener = useEvent(
    (listener: (notification: JengaNotifyApiPropsWithID) => void) => {
      const callback = (e) => listener((e as DismissEvent).detail);

      const unsub = () =>
        rootRef?.current?.removeEventListener(DISMISS_EVENT_NAME, callback);

      listeners.current.push(unsub);
      rootRef?.current?.addEventListener(DISMISS_EVENT_NAME, callback);

      return unsub;
    },
  );

  useEffect(() => () => listeners.current.forEach((cb) => cb()), []);

  const api = useMemo<JengaNotificationsApi>(
    () => ({ notify: addToast, update: updateToast, remove: removeToast }),
    // All deps are stable since we use `useEvent` hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    api,
    notifications: useMemo(() => [...notifications.values()], [notifications]),
    onDismissNotification,
    addOnDismissListener,
  } as const;
}
