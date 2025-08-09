import mongoose, { Schema, Document } from "mongoose";

interface IAnswer {
  questionId: string;
  type: string;
  data: any;
}

export interface IResponse extends Document {
  formId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

const AnswerSchema = new Schema({
  questionId: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
});

const ResponseSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  answers: [AnswerSchema],
  submittedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
});

export default mongoose.model<IResponse>("Response", ResponseSchema);
