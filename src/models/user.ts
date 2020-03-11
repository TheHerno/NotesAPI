import bcrypt from "bcrypt";
import { NextFunction } from "express";
import { Document, model, Schema, Types } from "mongoose";
import { INote } from "./note";
const ObjectId = Schema.Types.ObjectId;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  notes: Types.ObjectId[] | INote[];
  comparePassword: (password: string) => Promise<boolean>;
  getId: () => Schema.Types.ObjectId;
  setPassword: (password: string) => void;
  getUsername: () => string;
  getEmail: () => string;
  addNote: (id: Types.ObjectId) => void;
  deleteNote: (id: Types.ObjectId) => void;
  containsNote: (id: string) => boolean;
}

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  notes: [{ type: ObjectId, ref: "Notes", required: true }]
});

userSchema.pre<IUser>("save", async function(next: NextFunction) {
  const user = this;
  if (!user.isModified("password")) return next;
  const salt = await bcrypt.genSalt(15);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// hago getters & setters aunque sean propiedad públicas para no tener que cambiar el controller en caso de cambiar db

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getId = function(): Schema.Types.ObjectId {
  return this._id;
};

userSchema.methods.getUsername = function(): string {
  return this.username;
};

userSchema.methods.getEmail = function(): string {
  return this.email;
};

userSchema.methods.addNote = function(id: Types.ObjectId): void {
  this.notes.push(id);
};

userSchema.methods.deleteNote = function(id: Types.ObjectId): void {
  this.notes = this.notes.filter((note: Types.ObjectId) => note !== id);
};

userSchema.methods.setPassword = function(password: string): void {
  this.password = password;
};

userSchema.methods.containsNote = function(id: string): boolean {
  this.notes = this.notes as Types.ObjectId[];
  return this.notes.includes(id);
};

export default model<IUser>("User", userSchema);
