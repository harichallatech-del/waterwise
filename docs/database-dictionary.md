# Database dictionary
- profiles: external identity subject, role and preferences
- properties: building location and demand; PostGIS geography supports spatial queries
- roof_surfaces: area, roof material, runoff and collection coefficients
- rainfall_observations: monthly rainfall, provenance and verification flag
- water_use_profiles: household occupancy, bath/laundry assumptions and recovery fraction
- calculation_runs: versioned input/output snapshots for reproducibility
- recommendations: explainable guidance, priority and evidence
- sensor_devices / sensor_readings: IoT registry and time-stamped telemetry
- treatment_methods: treatment catalogue with professional review flag
- water_quality_measurements: lab/field measurements
- model_versions: calculation or model version registry
- prediction_outcomes: predicted versus observed data for evaluation
Use explicit units and UTC timestamps. Add auth, ownership checks and tenant isolation before real household data is stored.
