import mongoose from "mongoose";

const Schema = mongoose.Schema;

const QuerySchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true, maxLength: 100000 },
    translations: {
      type: Map,
      of: {
        question: String,
        answer: String,
      },
    },
  },
  { timestamps: true }
);

QuerySchema.methods.translateContent = function (lang) {
    const translation = this.translations?.get(lang);
    return translation
      ? { question: translation.question, answer: translation.answer }
      : { question: this.question, answer: this.answer, message: `Translation not available for language: ${lang}` };
  };

const Faq = mongoose.model.Faq || mongoose.model("Faq", QuerySchema);

export default Faq;
