import { Request } from "express";

/**
 * Extracts the requested language from the request.
 * Checks `req.query.lang`, then falls back to `req.headers["accept-language"]`, then "en".
 */
export const getRequestedLanguage = (req: Request): string => {
  if (req.query.lang && typeof req.query.lang === "string") {
    return req.query.lang.toLowerCase();
  }
  
  const acceptLang = req.headers["accept-language"];
  if (acceptLang) {
    const primaryLang = acceptLang.split(",")[0].split("-")[0].toLowerCase();
    if (primaryLang) {
        return primaryLang;
    }
  }
  
  return "en";
};

/**
 * Transforms a document by replacing its default fields with localized strings
 * based on the document's `translationFields` definition.
 * Safely handles both Mongoose Map objects and plain POJOs.
 */
export const localizeDocument = (
  doc: any,
  requestedLang: string
) => {
  const plainDoc = doc.toObject ? doc.toObject() : { ...doc };

  // Guarantee a strict string ID for frontend tables
  if (plainDoc._id) {
    plainDoc.id = plainDoc._id.toString();
    plainDoc._id = plainDoc._id.toString();
  }

  // If the document has no translation config, return it as is
  if (!plainDoc.translations) {
    return plainDoc;
  }

  const defaultLanguage = plainDoc.defaultLanguage || "en";
  const translationFields = plainDoc.translationFields || [];

  // Extract translation map safely whether it is a JS Map or POJO
  let langData: any = null;
  if (plainDoc.translations instanceof Map) {
    langData = plainDoc.translations.get(requestedLang);
  } else if (typeof plainDoc.translations === "object") {
    langData = plainDoc.translations[requestedLang];
  }

  // If requested language is not the default, replace fields with translation overrides
  if (requestedLang !== defaultLanguage && langData) {
    translationFields.forEach((field: string) => {
      if (langData[field] !== undefined) {
        plainDoc[field] = langData[field];
      }
    });
  }

  // Strip translation metadata so clean output is sent
  delete plainDoc.translations;
  delete plainDoc.translationFields;
  delete plainDoc.defaultLanguage;
  delete plainDoc.__v;

  return plainDoc;
};

/**
 * Helper to localize an entire array of documents
 */
export const localizeArray = (
  docs: any[],
  requestedLang: string
) => {
  return docs.map((doc) => localizeDocument(doc, requestedLang));
};
