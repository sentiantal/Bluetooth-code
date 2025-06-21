// context/SoilDataContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SoilData {
  label: string;
  value: string;
  unit: string;
  goodRangeMin: number;
  goodRangeMax: number;
}

interface SoilDataContextType {
  soilData: SoilData[];
  setSoilData: (data: SoilData[]) => void;
  bleInput: number[];
  setBleInput: (input: number[]) => void;
}

const SoilDataContext = createContext<SoilDataContextType | undefined>(undefined);

export const SoilDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [soilData, setSoilData] = useState<SoilData[]>([]);
  const [bleInput, setBleInput] = useState<number[]>([]);

  return (
    <SoilDataContext.Provider value={{ soilData, setSoilData, bleInput, setBleInput }}>
      {children}
    </SoilDataContext.Provider>
  );
};

export const useSoilData = () => {
  const context = useContext(SoilDataContext);
  if (!context) {
    throw new Error('useSoilData must be used within a SoilDataProvider');
  }
  return context;
};