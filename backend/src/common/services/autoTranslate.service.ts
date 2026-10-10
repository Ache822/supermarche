import translate from "translate";

// Set default engine to Google Translate
translate.engine = "google";

/**
 * Helper to wrap promises with a fast timeout safeguard
 */
const withTimeout = <T>(promise: Promise<T>, ms = 2000, fallback: T): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
};

/**
 * Automatically translates a plain text or HTML string from a source language to a target language.
 */
export const autoTranslateText = async (
  text: string,
  targetLang = "fr",
  sourceLang = "en"
): Promise<string> => {
  if (!text || typeof text !== "string" || !text.trim()) return text;
  try {
    const translationPromise = translate(text, { from: sourceLang, to: targetLang });
    const translated = await withTimeout(translationPromise, 2000, text);
    return translated || text;
  } catch (error) {
    console.warn(`[AutoTranslate] Falling back to original text for '${text.slice(0, 30)}...':`, error);
    return text;
  }
};

/**
 * Automatically generates a translations dictionary for any dynamic content payload.
 * Supports bidirectional translation (EN -> FR or FR -> EN) depending on defaultLanguage!
 */
export const autoTranslateObject = async (
  payload: Record<string, any>,
  fieldsToTranslate: string[],
  targetLang = "fr",
  sourceLang = "en"
): Promise<Record<string, any>> => {
  const result: Record<string, any> = {};

  for (const field of fieldsToTranslate) {
    const value = payload[field];
    if (value && typeof value === "string" && value.trim()) {
      result[field] = await autoTranslateText(value, targetLang, sourceLang);
    } else if (value && typeof value === "object" && (value[sourceLang] || value.en || value.fr)) {
      const srcText = value[sourceLang] || value.en || value.fr;
      result[field] = await autoTranslateText(srcText, targetLang, sourceLang);
    }
  }

  return result;
};
