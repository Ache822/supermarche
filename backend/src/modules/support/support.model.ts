import { Schema, model, Document } from "mongoose";

export interface ISupportSession extends Document {
  session_id: string;
  user_name?: string;
  customer_name?: string;
  customer_email?: string | null;
  topic?: string;
  status: "OPEN" | "CLAIMED" | "RESOLVED" | "ARCHIVED";
  assigned_to?: string | null;
  last_activity_at: Date;
  started_at?: Date;
  locale?: string;
  resolution_notes?: string | null;
  transcript_summary?: string | null;
  resolved_at?: Date | null;
  resolved_by?: string | null;
  metadata?: Schema.Types.Mixed;
}

export interface ISupportMessage extends Document {
  message_id: string;
  session_id: string;
  sender: string;
  body: string;
  sent_at: Date;
  is_starred: boolean;
  is_archived: boolean;
  created_by?: string | null;
  starred_by?: string | null;
  archived_by?: string | null;
  archived_at?: Date | null;
  attachment_url?: string | null;
  attachmentUrl?: string | null;
  attachment_type?: string | null;
  attachmentType?: string | null;
  reply_to_message_id?: string | null;
  replyToMessageId?: string | null;
}

export interface IResolvedChat extends Document {
  session_id: string;
  customer_name?: string;
  customer_email?: string | null;
  user_name?: string;
  resolved_by?: string;
  resolution_notes?: string;
  transcript_summary?: string;
  resolved_at?: Date;
}

const sessionSchema = new Schema<ISupportSession>(
  {
    session_id: { type: String, required: true, unique: true },
    user_name: { type: String },
    customer_name: { type: String },
    customer_email: { type: String, default: null },
    topic: { type: String, default: "General Support" },
    status: { type: String, enum: ["OPEN", "CLAIMED", "RESOLVED", "ARCHIVED"], default: "OPEN" },
    assigned_to: { type: String, default: null },
    last_activity_at: { type: Date, default: Date.now },
    started_at: { type: Date, default: Date.now },
    locale: { type: String, default: "en" },
    resolution_notes: { type: String, default: null },
    transcript_summary: { type: String, default: null },
    resolved_at: { type: Date, default: null },
    resolved_by: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

const messageSchema = new Schema<ISupportMessage>(
  {
    message_id: { type: String, required: true, unique: true },
    session_id: { type: String, required: true, index: true },
    sender: { type: String, required: true },
    body: { type: String, default: "" },
    sent_at: { type: Date, default: Date.now },
    is_starred: { type: Boolean, default: false },
    is_archived: { type: Boolean, default: false },
    created_by: { type: String, default: null },
    starred_by: { type: String, default: null },
    archived_by: { type: String, default: null },
    archived_at: { type: Date, default: null },
    attachment_url: { type: String, default: null },
    attachmentUrl: { type: String, default: null },
    attachment_type: { type: String, default: null },
    attachmentType: { type: String, default: null },
    reply_to_message_id: { type: String, default: null },
    replyToMessageId: { type: String, default: null }
  },
  { timestamps: true }
);

const resolvedChatSchema = new Schema<IResolvedChat>(
  {
    session_id: { type: String, required: true },
    customer_name: { type: String },
    customer_email: { type: String, default: null },
    user_name: { type: String },
    resolved_by: { type: String },
    resolution_notes: { type: String },
    transcript_summary: { type: String },
    resolved_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const SupportSession = model<ISupportSession>("SupportSession", sessionSchema);
export const SupportMessage = model<ISupportMessage>("SupportMessage", messageSchema);
export const ResolvedChat = model<IResolvedChat>("ResolvedChat", resolvedChatSchema);
