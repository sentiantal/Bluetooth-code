export const mockSoilData = {
  nutrients: [
    {
      id: 'boron',
      name: 'Boron (B)',
      value: 0.32,
      unit: 'ppm',
      status: 'low',
      description: 'Boron is a micronutrient essential for cell division, protein formation, and proper pollination.',
      role: 'Helps in cell wall formation, sugar transport, and hormone development. Critical for flowering and fruiting.',
      recommendation: 'Apply a boron-containing fertilizer or soil amendment. For most crops, target a soil level of 0.5-2.0 ppm.'
    },
    {
      id: 'calcium',
      name: 'Calcium (Ca)',
      value: 316.34,
      unit: 'ppm',
      status: 'moderate',
      description: 'Calcium is a secondary nutrient vital for cell wall structure, root development, and overall plant health.',
      role: 'Strengthens cell walls, improves soil structure, and helps neutralize soil acidity. Prevents blossom end rot in fruits.',
      recommendation: 'Consider adding agricultural lime or gypsum to increase calcium levels. Target range for most crops is 400-2000 ppm.'
    },
    {
      id: 'copper',
      name: 'Copper (Cu)',
      value: 2.38,
      unit: 'ppm',
      status: 'good',
      description: 'Copper is a micronutrient involved in enzyme activation and chlorophyll production.',
      role: 'Assists in photosynthesis, respiration, and protein metabolism. Important for reproductive growth.',
      recommendation: 'Current levels are adequate. Monitor levels annually to ensure they remain in the optimal range.'
    },
    {
      id: 'ec',
      name: 'Electrical Conductivity (EC)',
      value: 0.05,
      unit: 'dS/m',
      status: 'good',
      description: 'Electrical Conductivity measures the soil\'s ability to conduct electricity, indicating the concentration of soluble salts.',
      role: 'Helps assess soil salinity. High EC can inhibit water uptake and nutrient availability.',
      recommendation: 'Current EC levels are good. Continue current practices and monitor occasionally.'
    },
    {
      id: 'iron',
      name: 'Iron (Fe)',
      value: 108.68,
      unit: 'ppm',
      status: 'good',
      description: 'Iron is a micronutrient essential for chlorophyll formation and oxygen transport within the plant.',
      role: 'Critical for photosynthesis, nitrogen fixation, and energy transfer. Deficiency causes interveinal chlorosis.',
      recommendation: 'Iron levels are adequate. No additional iron fertilization is needed at this time.'
    },
    {
      id: 'potassium',
      name: 'Potassium Content',
      value: 178.79,
      unit: 'kg/ha',
      status: 'moderate',
      description: 'Potassium is a primary macronutrient that regulates many plant processes including water uptake.',
      role: 'Improves drought resistance, disease resistance, and overall vigor. Enhances quality of fruits and vegetables.',
      recommendation: 'Apply potassium-rich fertilizer to reach optimal levels. Consider potassium sulfate or potassium chloride application.'
    },
    {
      id: 'magnesium',
      name: 'Magnesium (Mg)',
      value: 125.92,
      unit: 'ppm',
      status: 'low',
      description: 'Magnesium is a secondary nutrient and a central component of chlorophyll, the green pigment in plants.',
      role: 'Essential for photosynthesis and activation of many plant enzymes. Helps in phosphorus utilization.',
      recommendation: 'Apply dolomitic lime or Epsom salts (magnesium sulfate) to increase levels. Target range is 150-300 ppm.'
    },
    {
      id: 'nitrogen',
      name: 'Total Nitrogen (N)',
      value: 0.09,
      unit: '%',
      status: 'low',
      description: 'Nitrogen is a primary macronutrient essential for protein synthesis and plant growth.',
      role: 'Promotes leafy growth, forms amino acids, proteins, and chlorophyll. Deficiency causes yellowing of older leaves.',
      recommendation: 'Apply nitrogen fertilizer in split applications. Consider using slow-release nitrogen sources or legume cover crops.'
    },
    {
      id: 'organic-carbon',
      name: 'Organic Carbon (OC)',
      value: -2.32,
      unit: '%',
      status: 'low',
      description: 'Organic Carbon is an indicator of organic matter content in soil, which improves soil structure and nutrient retention.',
      role: 'Enhances water holding capacity, provides nutrients, improves soil structure, and supports beneficial soil organisms.',
      recommendation: 'Add compost, manure, or other organic materials. Practice crop rotation and use cover crops to build soil organic matter.'
    },
    {
      id: 'ph',
      name: 'pH Level',
      value: 5.93,
      unit: '',
      status: 'moderate',
      description: 'Soil pH measures the acidity or alkalinity of soil and affects nutrient availability.',
      role: 'Influences nutrient availability, microbial activity, and overall plant health. Most crops prefer pH between 6.0-7.0.',
      recommendation: 'Apply agricultural lime to raise pH slightly. Aim for a pH of 6.5 for most crops.'
    },
    {
      id: 'phosphorus',
      name: 'Phosphorus Content',
      value: 16.24,
      unit: 'kg/ha',
      status: 'low',
      description: 'Phosphorus is a primary macronutrient essential for energy transfer and root development.',
      role: 'Critical for root development, flowering, fruiting, and seed production. Important for energy transfer within plants.',
      recommendation: 'Apply phosphorus fertilizer such as superphosphate or bone meal. Incorporate into the soil near the root zone.'
    },
    {
      id: 'sulfur',
      name: 'Sulfur (S)',
      value: 6.81,
      unit: 'ppm',
      status: 'low',
      description: 'Sulfur is a secondary nutrient required for protein synthesis and enzyme activation.',
      role: 'Component of amino acids and proteins. Helps with chlorophyll formation and promotes nodule formation in legumes.',
      recommendation: 'Apply sulfur-containing fertilizers such as ammonium sulfate or gypsum. Target range is 10-20 ppm.'
    },
    {
      id: 'zinc',
      name: 'Zinc (Zn)',
      value: 2.09,
      unit: 'ppm',
      status: 'good',
      description: 'Zinc is a micronutrient involved in enzyme systems and hormone production.',
      role: 'Important for enzyme activation, protein synthesis, and hormone regulation. Critical for stem growth and leaf development.',
      recommendation: 'Current zinc levels are adequate. Continue to monitor annually.'
    }
  ],
  texture: {
    clay: {
      name: 'Total Clay',
      value: 17.12,
      unit: '%'
    },
    sand: {
      name: 'Total Sand Content',
      value: 148.52,
      unit: '%'
    },
    silt: {
      name: 'Total Silt Content',
      value: 12.38,
      unit: '%'
    }
  },
  waterRetention: {
    at10kPa: {
      name: 'Water Retention at 10 kPa',
      value: 527.51,
      unit: '%',
      description: 'Field Capacity - The amount of water held in soil after excess water has drained away.'
    },
    at33kPa: {
      name: 'Water Retention at 33 kPa',
      value: 300.41,
      unit: '%',
      description: 'Mid-range soil moisture - Water still readily available to plants.'
    },
    at1500kPa: {
      name: 'Water Retention at 1500 kPa',
      value: -176.10,
      unit: '%',
      description: 'Permanent Wilting Point - The point at which plants can no longer extract water from soil.'
    },
    moisture: {
      name: 'Soil Moisture',
      value: 300.41,
      unit: '%',
      description: 'Current water content in the soil.'
    }
  }
};