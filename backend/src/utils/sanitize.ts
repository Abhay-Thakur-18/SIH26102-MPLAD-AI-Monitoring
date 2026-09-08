import xss from "xss";

export const sanitizeString = (value: string): string => xss(value).trim();

export const deepSanitize = <T>(input: T): T => {
  if (typeof input === "string") return sanitizeString(input) as T;
  if (Array.isArray(input)) return input.map((item) => deepSanitize(item)) as T;
  if (input && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = deepSanitize(v);
    }
    return out as T;
  }
  return input;
};
