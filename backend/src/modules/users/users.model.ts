import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  authId?: string;
  email: string;
  password_hash?: string;
  fullName?: string;
  access: "SUPER_ADMIN" | "ADMIN";
  permissions: string[];
  is_active: boolean;
}

const userSchema = new Schema<IUser>(
  {
    authId: { type: String, unique: true, sparse: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String },
    fullName: { type: String, trim: true },
    access: { type: String, enum: ["SUPER_ADMIN", "ADMIN"], default: "ADMIN" },
    permissions: [{ type: String, default: [] }],
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);

export interface IInvitation extends Document {
  email: string;
  permissions: string[];
  token_hash: string;
  is_accepted: boolean;
  expires_at: Date;
  accepted_at?: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    permissions: [{ type: String, required: true }],
    token_hash: { type: String, required: true },
    is_accepted: { type: Boolean, default: false },
    expires_at: { type: Date, required: true },
    accepted_at: { type: Date }
  },
  { timestamps: true }
);

export const Invitation = model<IInvitation>("Invitation", invitationSchema);
