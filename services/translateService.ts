export const translateText = async (text: string, targetLang: string) => {
    try {
        const response = await fetch("https://mxmgyp3unr.ap-south-1.awsapprunner.com/api/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, targetLang })
        });

        const data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("Translation failed:", error);
        return text;
    }
};