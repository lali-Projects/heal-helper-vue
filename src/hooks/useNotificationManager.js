import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../lib/apiClient";
import { selectToken, selectUser } from "../features/auth/authSlice";
import { getPushTokens } from "./useNotification";

const DEVICE_ID_KEY = "medremind.deviceId";
const LAST_SYNC_KEY = "medremind.lastDeviceSync";
const SYNC_THROTTLE_MS = 60_000; // 1 min

function generateFallbackDeviceId() {
  return (
    "web-" +
    (crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`)
  );
}

function detectPlatformType() {
  if (typeof window !== "undefined" && window.electronAPI) return "ELECTRON";
  if (typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.()) {
    const p = window.Capacitor.getPlatform?.();
    if (p === "ios") return "IOS";
    if (p === "android") return "ANDROID";
    return "NATIVE";
  }
  return "WEB";
}

async function resolveDeviceId() {
  // 1) Electron preload bridge
  try {
    if (typeof window !== "undefined" && window.electronAPI?.getMachineId) {
      const id = await window.electronAPI.getMachineId();
      if (id) return `electron-${id}`;
    }
  } catch {
    /* ignore */
  }

  // 2) Capacitor Device plugin (runtime-resolved; do not bundle)
  try {
    if (typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.()) {
      // eslint-disable-next-line no-new-func
      const dynamicImport = new Function("s", "return import(s)");
      const mod = await dynamicImport("@capacitor/device");
      const info = await mod.Device.getId();
      if (info?.identifier) return `cap-${info.identifier}`;
    }
  } catch {
    /* ignore */
  }

  // 3) Browser fallback — persistent per-browser id
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateFallbackDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return generateFallbackDeviceId();
  }
}

export function useNotificationManager() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [isInactive, setIsInactive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const inFlightRef = useRef(false);

  const buildDto = useCallback(async ({ refreshPushTokens = true } = {}) => {
    const deviceId = await resolveDeviceId();
    const platformType = detectPlatformType();

    let pushFields = {
      endpoint: user?.pushEndpoint ?? null,
      pushP256dh: user?.pushP256dh ?? null,
      pushAuth: user?.pushAuth ?? null,
    };

    if (refreshPushTokens) {
      try {
        const t = await getPushTokens();
        pushFields = {
          endpoint: t.pushEndpoint,
          pushP256dh: t.pushP256dh,
          pushAuth: t.pushAuth,
        };
      } catch (e) {
        // Keep stored tokens if browser push isn't available (e.g. native shell)
        if (platformType === "WEB") throw e;
      }
    }

    return { deviceId, platformType, ...pushFields };
  }, [user]);

  const transferDevice = useCallback(
    async ({ refreshPushTokens = true, reload = true } = {}) => {
      if (!token || !user) throw new Error("User not authenticated");
      if (inFlightRef.current) return null;
      inFlightRef.current = true;
      setIsSyncing(true);
      setError(null);
      try {
        const dto = await buildDto({ refreshPushTokens });
        const { data } = await apiClient.post("/api/users/push/transfer", dto);
        try {
          localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
        setIsInactive(Boolean(data?.isInactive));
        if (reload && !data?.isInactive) {
          // Re-sync active status across the app
          window.location.reload();
        }
        return data;
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Sync failed");
        throw e;
      } finally {
        inFlightRef.current = false;
        setIsSyncing(false);
      }
    },
    [token, user, buildDto]
  );

  // Throttled sync on init — only checks active status, does not refresh tokens
  useEffect(() => {
    if (!token || !user) return;
    let cancelled = false;

    const run = async () => {
      try {
        const last = Number(localStorage.getItem(LAST_SYNC_KEY) || 0);
        if (Date.now() - last < SYNC_THROTTLE_MS) return;
        const dto = await buildDto({ refreshPushTokens: false });
        if (cancelled) return;
        const { data } = await apiClient.post("/api/users/push/transfer", dto);
        if (cancelled) return;
        localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
        setIsInactive(Boolean(data?.isInactive));
      } catch (e) {
        if (!cancelled) setError(e?.message || "Init sync failed");
      }
    };

    const id = setTimeout(run, 500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [token, user, buildDto]);

  return { isInactive, isSyncing, error, transferDevice };
}
