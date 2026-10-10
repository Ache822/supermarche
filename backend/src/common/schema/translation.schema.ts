import { Schema } from "mongoose";

export const translationSchema = {
    defaultLanguage: { type: String, default: "en" },
    translations: { type: Map, of: Schema.Types.Mixed, default: {} }
}
