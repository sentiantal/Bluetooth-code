import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { translateText } from "@/services/translateService";
import { useLanguage } from "@/context/LanguageContext";

type Props = { text: string };

export const TranslatedText: React.FC<Props> = ({ text }) => {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    const fetchTranslation = async () => {
      const result = await translateText(text, language);
      setTranslated(result);
    };
    fetchTranslation();
  }, [text, language]);

  return <Text>{translated}</Text>;
};