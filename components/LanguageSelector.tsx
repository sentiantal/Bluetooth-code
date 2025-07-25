import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLanguage } from "@/context/LanguageContext";
import React from "react";

const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={language}
                onValueChange={setLanguage}
                style={styles.picker}
                dropdownIconColor="black"
            >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Telugu (తెలుగు)" value="te" />
                <Picker.Item label="Hindi (हिंदी)" value="hi" />
                <Picker.Item label="Marathi (मराठी)" value="mr" />
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingTop: 4,
    },
    picker: {
        width: 160,
        color: "#000",
    },
});

export default LanguageSelector;