package cn.arorms.sdd.data.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Data @Entity @Table(name = "defect_detection_results")
public class DefectDetectionResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "result_figure")
    private byte[] resultFigure;

    @CreationTimestamp
    @Column(name = "Timestamp")
    private LocalDateTime timestamp;

    @Column(name = "has_inclusion")
    private boolean hasInclusion;

    @Column(name = "has_patch")
    private boolean hasPatch;

    @Column(name = "has_scratch")
    private boolean hasScratch;
    
    @Column(name = "has_other")
    private boolean hasOther;

    @Column(name = "time_cost")
    private double timeCost;

    @Column(name = "defect_number")
    private int defectNumber;

    @Column(name = "detect_confidences")
    private String detectConfidences;
}
