package cn.arorms.sdd.data.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity @Table(name = "defect_detection_results")
public class DefectDetectionResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "result_figure")
    private byte[] resultFigure;

    @CreationTimestamp
    @Column(name = "timestamp")
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private Batch batch;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getResultFigure() {
        return resultFigure;
    }

    public void setResultFigure(byte[] resultFigure) {
        this.resultFigure = resultFigure;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isHasInclusion() {
        return hasInclusion;
    }

    public void setHasInclusion(boolean hasInclusion) {
        this.hasInclusion = hasInclusion;
    }

    public boolean isHasPatch() {
        return hasPatch;
    }

    public void setHasPatch(boolean hasPatch) {
        this.hasPatch = hasPatch;
    }

    public boolean isHasScratch() {
        return hasScratch;
    }

    public void setHasScratch(boolean hasScratch) {
        this.hasScratch = hasScratch;
    }

    public boolean isHasOther() {
        return hasOther;
    }

    public void setHasOther(boolean hasOther) {
        this.hasOther = hasOther;
    }

    public double getTimeCost() {
        return timeCost;
    }

    public void setTimeCost(double timeCost) {
        this.timeCost = timeCost;
    }

    public int getDefectNumber() {
        return defectNumber;
    }

    public void setDefectNumber(int defectNumber) {
        this.defectNumber = defectNumber;
    }

    public String getDetectConfidences() {
        return detectConfidences;
    }

    public void setDetectConfidences(String detectConfidences) {
        this.detectConfidences = detectConfidences;
    }

    public Batch getBatch() {
        return batch;
    }

    public void setBatch(Batch batch) {
        this.batch = batch;
    }
}
