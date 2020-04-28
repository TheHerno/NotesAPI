import { Model, Schema, Document, Types, model } from "mongoose";

export interface INote extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId;
}

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    lowercase: false,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  author: {
    type: Types.ObjectId,
    ref: "User",
  },
});

export default model<INote>("Note", noteSchema);
