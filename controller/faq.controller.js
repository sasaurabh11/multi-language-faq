import { languages } from "../constants.js";
import translationofContent from "../services/googleTranslation.service.js";
import Faq from "../models/faq.model.js";
import redisClient from "../services/redis.client.js";

// Function to create a new FAQ
const createQuery = async (req, res, next) => {
    try {
      const { question, answer } = req.body;
  
      // Create promises for translating the question and answer in all languages
      const translationsPromises = languages.map(async (lang) => {
        const questionTranslation = await translationofContent(question, lang);
        const answerTranslation = await translationofContent(answer, lang);
        return { lang, questionTranslation, answerTranslation };
      });
  
      const translationsResults = await Promise.all(translationsPromises);
  
      const translations = {
        question: new Map(),
        answer: new Map(),
      };
  
      translationsResults.forEach(({ lang, questionTranslation, answerTranslation }) => {
        translations.question.set(lang, questionTranslation);
        translations.answer.set(lang, answerTranslation); 
      });
  
      const faq = new Faq({ question, answer, translations });
      await faq.save();
  
      const cacheKeys = await redisClient.keys("faqs:*");
      if (cacheKeys.length > 0) {
        await redisClient.del(cacheKeys);
      }
  
      res.status(201).json({ message: "FAQ created", data: faq });
    } catch (error) {
      next(error); 
    }
  };
  
// Function to get all FAQs, potentially from cache
const getQueries = async (req, res, next) => {
  try {
    const { lang = "en" } = req.query;
    const cacheKey = `faqs:${lang}`;

    
    // Checking if the FAQ data is already cached in Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If data is not cached, fetch it from the database
    const faqs = await Faq.find();
    const translatedFAQs = faqs.map((faq) => {
        const translatedContent = faq.getTranslatedContent(lang);
      
        return {
          _id: faq._id,
          ...translatedContent,
        };
      });

    // Caching the translated FAQ data in Redis for future use
    await redisClient.set(cacheKey, JSON.stringify(translatedFAQs), {
      EX: 3600,
    });

    res.status(200).json(translatedFAQs);
  } catch (error) {
    next(error);
  }
};

export {createQuery, getQueries}
