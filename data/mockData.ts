export const mockSoilData = {
  healthScore: 75,
  healthStatus: 'Good Condition',
  indicators: [
    {
      title: 'Nutrients',
      status: 'moderate',
      value: '7/13 optimal',
      icon: 'leaf',
      description: 'Essential nutrients for plant growth',
      details: [
        'Nitrogen: 0.09%',
        'Phosphorus: 16.24 ppm',
        'Potassium: moderate'
      ],
      route: 'nutrients'
    },
    {
      title: 'Texture',
      status: 'good',
      value: 'Sandy Loam',
      icon: 'mountain',
      description: 'Soil composition and structure',
      details: [
        'Clay: 17.12%',
        'Sand: 48.52%',
        'Good drainage'
      ],
      route: 'texture'
    },
    {
      title: 'Water',
      status: 'poor',
      value: 'Low',
      icon: 'droplets',
      description: 'Soil moisture and water retention',
      details: [
        'Moisture: 27.51%',
        'Optimal: 30-40%',
        'Needs irrigation'
      ],
      route: 'water'
    }
  ],
  alerts: [
    {
      title: 'Low Nitrogen Levels',
      description: 'Nitrogen deficiency detected. This may affect plant growth and yield.',
    },
    {
      title: 'Moisture Content Below Optimal',
      description: 'Current soil moisture is below recommended levels for your crops. Consider irrigation.'
    }
  ],
  actions: [
    {
      title: 'Add Organic Matter',
      description: 'Improve soil structure and fertility',
      color: '#2E7D32'
    },
    {
      title: 'Apply Fertilizer',
      description: 'Address nutrient deficiencies',
      color: '#1976D2'
    },
    {
      title: 'Monitor pH',
      description: 'Check soil pH regularly',
      color: '#F57C00'
    }
  ],
  nutrientDetails: {
    macronutrients: [
      { name: 'Nitrogen', value: '0.09%', status: 'low', optimal: '0.2-0.5%' },
      { name: 'Phosphorus', value: '16.24 ppm', status: 'moderate', optimal: '20-30 ppm' },
      { name: 'Potassium', value: '156.8 ppm', status: 'good', optimal: '150-250 ppm' },
      { name: 'Calcium', value: '1245 ppm', status: 'good', optimal: '1000-2000 ppm' },
      { name: 'Magnesium', value: '165 ppm', status: 'good', optimal: '150-300 ppm' },
      { name: 'Sulfur', value: '12 ppm', status: 'low', optimal: '15-20 ppm' }
    ],
    micronutrients: [
      { name: 'Iron', value: '4.5 ppm', status: 'moderate', optimal: '4-10 ppm' },
      { name: 'Manganese', value: '1.2 ppm', status: 'moderate', optimal: '1-5 ppm' },
      { name: 'Zinc', value: '0.8 ppm', status: 'low', optimal: '1-3 ppm' },
      { name: 'Copper', value: '0.3 ppm', status: 'moderate', optimal: '0.3-1 ppm' },
      { name: 'Boron', value: '0.2 ppm', status: 'low', optimal: '0.5-1 ppm' },
      { name: 'Molybdenum', value: '0.05 ppm', status: 'moderate', optimal: '0.05-0.1 ppm' },
      { name: 'Chlorine', value: '25 ppm', status: 'good', optimal: '20-40 ppm' }
    ],
    ph: { value: 6.2, status: 'good', optimal: '6.0-7.0' }
  },
  textureDetails: {
    composition: {
      sand: 48.52,
      silt: 34.36,
      clay: 17.12
    },
    type: 'Sandy Loam',
    properties: [
      { name: 'Water Infiltration', value: 'Good', description: 'Water moves easily through the soil' },
      { name: 'Water Retention', value: 'Moderate', description: 'Holds adequate moisture for plant growth' },
      { name: 'Aeration', value: 'Good', description: 'Good oxygen levels for root development' },
      { name: 'Drainage', value: 'Good', description: 'Drains well, prevents waterlogging' },
      { name: 'Nutrient Retention', value: 'Moderate', description: 'Medium capacity to hold nutrients' },
      { name: 'Workability', value: 'Good', description: 'Easy to till and work with' }
    ]
  },
  waterDetails: {
    currentMoisture: 27.51,
    optimalRange: { min: 30, max: 40 },
    history: [
      { date: '2023-05-01', value: 32.5 },
      { date: '2023-05-02', value: 31.8 },
      { date: '2023-05-03', value: 30.2 },
      { date: '2023-05-04', value: 29.4 },
      { date: '2023-05-05', value: 28.7 },
      { date: '2023-05-06', value: 28.1 },
      { date: '2023-05-07', value: 27.5 }
    ],
    fieldCapacity: 42.6,
    wiltingPoint: 18.3,
    availableWaterCapacity: 24.3,
    recommendations: [
      'Apply 1.5 inches of irrigation within the next 48 hours',
      'Implement mulching to reduce evaporation',
      'Consider drip irrigation for efficient water use'
    ]
  }
};