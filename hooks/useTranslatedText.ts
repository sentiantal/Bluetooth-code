import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateText } from "@/services/translateService";

export const useTranslatedText = (originalText: string) => {
    const { language } = useLanguage();
    const [translated, setTranslated] = useState(originalText);

    useEffect(() => {
        const fetchTranslation = async () => {
            const result = await translateText(originalText, language);
            setTranslated(result);
        };
        fetchTranslation();
    }, [originalText, language]);

    return translated;
};