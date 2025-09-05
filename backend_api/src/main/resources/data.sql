INSERT INTO defect_detection_results
(result_figure, timestamp, has_inclusion, has_patch, has_scratch, has_other, time_cost, defect_number, defect_confidences)
VALUES
(NULL, GETDATE(), 1, 0, 1, 0, 12.34, 2, '0.87,0.00,0.12,0.00'),
(NULL, GETDATE(), 0, 1, 0, 1, 8.50, 2, '0.00,0.95,0.00,0.05'),
(NULL, GETDATE(), 0, 0, 0, 1, 5.20, 1, '0.00,0.00,0.00,1.00'),
(NULL, GETDATE(), 1, 1, 1, 0, 15.75, 3, '0.90,0.80,0.75,0.00');