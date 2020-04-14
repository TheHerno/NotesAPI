import { model, Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  getId: () => Types.ObjectId;
  getTitle: () => string;
  getContent: () => string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
}

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    lowercase: false,
    trim: true
  },
  content: {
    type: String,
    trim: true
  }
});

noteSchema.methods.getId = function(): Types.ObjectId {
  return this._id;
};

noteSchema.methods.getTitle = function(): string {
  return this.title;
};

noteSchema.methods.getContent = function(): string {
  return this.content;
};

noteSchema.methods.setTitle = function(title: string): void {
  this.title = title;
};

noteSchema.methods.setContent = function(content: string): void {
  this.content = content;
};

export default model<INote>("Notes", noteSchema);
