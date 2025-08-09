import mongoose, { Schema, Document } from "mongoose";

interface IQuestion {
  id: string;
  type: "categorize" | "cloze" | "comprehension";
  title: string;
  image?: string;
  data: any;
}

export interface IForm extends Document {
  title: string;
  description: string;
  headerImage?: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["categorize", "cloze", "comprehension"],
  },
  title: { type: String, required: true },
  image: { type: String },
  data: { type: Schema.Types.Mixed, required: true },
});

const FormSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  headerImage: { type: String },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
FormSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IForm>("Form", FormSchema);
