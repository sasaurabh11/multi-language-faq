import translate from "translate";

const translationofContent = async (content, lang) => {
    try {
        return await translate(content, lang);
      } catch (err) {
        console.error("Translation failed:", err);
        return content;
      }
};

export default translationofContent;
