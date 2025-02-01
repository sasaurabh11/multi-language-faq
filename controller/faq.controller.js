import { languages } from "../constants.js";
import translationofContent from "../services/googleTranslation.service.js";
import Faq from "../models/faq.model.js";
// import redisClient from "../services/redis.client.js";

const createQuery = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    console.log(question, answer);

    const translations = {
      question: new Map(),
      answer: new Map(),
    };

    for (let lang of languages) {
      translations.question.set(lang, await translationofContent(question, lang));
      translations.answer.set(lang, await translationofContent(answer, lang));
    }

    console.log(translations);

    const faq = new Faq({ question, answer, translations });
    await faq.save();

    // const cacheKeys = await redisClient.keys("faqs:*");
    // if (cacheKeys.length > 0) {
    //   await redisClient.del(cacheKeys);
    // }

    res.status(201).json({ message: "FAQ created", data: faq });
  } catch (error) {
    next(error);
  }
};

const getQueries = async (req, res, next) => {
  try {
    const { lang = "en" } = req.query;
    // const cacheKey = `faqs:${lang}`;

    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   return res.status(200).json(JSON.parse(cachedData));
    // }

    const faqs = await Faq.find();
    const translatedFAQs = faqs.map((faq) => {
        const translatedContent = faq.getTranslatedContent(lang);
      
        return {
          _id: faq._id,
          ...translatedContent,
        };
      });

    // await redisClient.set(cacheKey, JSON.stringify(translatedFAQs), {
    //   EX: 3600,
    // });

    res.status(200).json(translatedFAQs);
  } catch (error) {
    next(error);
  }
};

export {createQuery, getQueries}
