export const error = (message: string) => {
  throw new Error(message);
};

export const isBrowser = () => {
  try {
    return typeof window !== "undefined";
  } catch (e) {
    return false;
  }
};

export function mergeTwoLevels<T extends Record<string,unknown>>(base: T, overlay?: Partial<T>) {
  const out: T = {...base};
  if (!overlay) {
    return out;
  }
  for (const [key, value] of Object.entries(overlay)) {
    const current = out[key] as T;
    if (typeof current === "object" && typeof value === "object") {
      (out[key] as T) = {
        ...current,
        ...value
      }
    } else {
      (out[key] as T) = value;
    }
  }
  return out;
}