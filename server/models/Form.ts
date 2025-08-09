import mongoose from "mongoose";

const FormFieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["text", "email", "textarea", "select", "radio", "checkbox"],
  },
  label: { type: String, required: true },
  placeholder: { type: String },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
});

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fields: [FormFieldSchema],
  },
  {
    timestamps: true,
  },
);

export const Form = mongoose.model("Form", FormSchema);
