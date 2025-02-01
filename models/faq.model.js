import mongoose from "mongoose";

const Schema = mongoose.Schema;

const QuerySchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true, maxLength: 100000 },
    translations: {
        question: { type: Map, of: String },
        answer: { type: Map, of: String },
    },
  },
  { timestamps: true }
);

QuerySchema.methods.getTranslatedContent = function (lang) {
    const translatedQuestion = this.translations?.question?.get(lang);
    const translatedAnswer = this.translations?.answer?.get(lang);
  
    return {
      question: translatedQuestion || this.question,
      answer: translatedAnswer || this.answer,
      ...(translatedQuestion && translatedAnswer ? {} : { message: `Translation not available for language: ${lang}` }),
    };
  };
  

const Faq = mongoose.model.Faq || mongoose.model("Faq", QuerySchema);

export default Faq;
