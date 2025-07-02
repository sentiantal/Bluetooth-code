import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LanguageContextType = {
    language: string;
    setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState("en");

    const setLanguage = async (lang: string) => {
        setLanguageState(lang);
        await AsyncStorage.setItem("selectedLanguage", lang);
    };

    useEffect(() => {
        const loadLanguage = async () => {
            const stored = await AsyncStorage.getItem("selectedLanguage");
            if (stored) setLanguageState(stored);
        };
        loadLanguage();
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);