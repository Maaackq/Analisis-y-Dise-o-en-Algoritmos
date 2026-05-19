INSERT OR IGNORE INTO nodes (id, name, lat, lng, type, description) VALUES
('N01', 'Centro Histórico', 22.7709, -102.5833, 'origin', 'Nodo urbano de referencia'),
('N02', 'Alameda', 22.7729, -102.5741, 'waypoint', 'Conexión central'),
('N03', 'Hospital General', 22.7604, -102.5688, 'service', 'Zona de servicios'),
('N04', 'Campus UAZ', 22.7751, -102.6072, 'education', 'Nodo académico'),
('N05', 'Guadalupe Centro', 22.7476, -102.5184, 'destination', 'Nodo oriental'),
('N06', 'Parque Arroyo', 22.7586, -102.5418, 'waypoint', 'Conector intermedio'),
('N07', 'Estación Norte', 22.7898, -102.5607, 'transport', 'Nodo de movilidad'),
('N08', 'Mirador Urbano', 22.7818, -102.5919, 'waypoint', 'Conexión panorámica'),
('N09', 'Zona Industrial', 22.7358, -102.5481, 'industry', 'Nodo sur'),
('N10', 'Terminal Sur', 22.7249, -102.5749, 'transport', 'Nodo terminal');

INSERT OR IGNORE INTO edges (id, source_id, target_id, distance, time, cost, bidirectional, label) VALUES
('E01', 'N01', 'N02', 1.15, 4.2, 1.4, 1, 'Centro-Alameda'),
('E02', 'N02', 'N03', 1.85, 5.1, 2.1, 1, 'Alameda-Hospital'),
('E03', 'N03', 'N06', 2.70, 7.5, 3.0, 1, 'Hospital-Parque'),
('E04', 'N06', 'N05', 2.95, 8.3, 3.6, 1, 'Parque-Guadalupe'),
('E05', 'N01', 'N08', 1.60, 5.9, 2.5, 1, 'Centro-Mirador'),
('E06', 'N08', 'N04', 2.25, 7.2, 2.7, 1, 'Mirador-Campus'),
('E07', 'N08', 'N07', 2.75, 7.8, 2.9, 1, 'Mirador-Estación'),
('E08', 'N07', 'N05', 5.85, 13.4, 6.0, 1, 'Estación-Guadalupe'),
('E09', 'N03', 'N09', 3.15, 8.6, 3.9, 1, 'Hospital-Industrial'),
('E10', 'N09', 'N10', 3.05, 7.9, 3.2, 1, 'Industrial-Terminal'),
('E11', 'N10', 'N01', 5.40, 14.8, 6.5, 1, 'Terminal-Centro'),
('E12', 'N02', 'N07', 2.10, 6.0, 2.4, 1, 'Alameda-Estación'),
('E13', 'N06', 'N09', 2.35, 6.8, 2.6, 1, 'Parque-Industrial'),
('E14', 'N04', 'N01', 3.00, 8.7, 3.1, 1, 'Campus-Centro'),
('E15', 'N04', 'N10', 6.30, 15.4, 6.8, 1, 'Campus-Terminal');
