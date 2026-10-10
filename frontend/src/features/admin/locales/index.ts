import enNav from './nav/en.json';
import frNav from './nav/fr.json';
import enUi from './ui/en.json';
import frUi from './ui/fr.json';
import enError from './error/en.json';
import frError from './error/fr.json';

type JsonObject = { [key: string]: unknown };

function deepMerge<T extends JsonObject>(target: T, source: JsonObject): T {
  const result = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal as JsonObject, sourceVal as JsonObject);
    } else {
      result[key] = sourceVal;
    }
  }
  return result as T;
}

export const adminTranslations = {
  en: deepMerge(deepMerge(enNav, enUi), enError),
  fr: deepMerge(deepMerge(frNav, frUi), frError),
};
