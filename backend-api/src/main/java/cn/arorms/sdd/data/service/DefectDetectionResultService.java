package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.controller.AuthController;
import cn.arorms.sdd.data.dtos.DetectionResultVisionData;
import cn.arorms.sdd.data.models.DefectDetectionResult;
import cn.arorms.sdd.data.repository.DefectDetectionResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing defect detection results.
 * @version 2.0 2025-09-06
 * @author Amzish
 */
@Service
public class DefectDetectionResultService {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final DefectDetectionResultRepository repository;
    public DefectDetectionResultService(DefectDetectionResultRepository repository) {
        this.repository = repository;
    }

    public void addDefectDetectionResult(DefectDetectionResult result) {
        log.info("Adding new detection result: {}", result);
        repository.save(result);
    }

    public DefectDetectionResult getDefectDetectionResultById(Long id) {
        var result = repository.findById(id);
        if (result.isPresent()) {
            return result.get();
        } else {
            throw new RuntimeException("Result not found with id: " + id);
        }
    }

    public Page<DefectDetectionResult> queryResults(
            LocalDateTime start,
            LocalDateTime end,
            String keyword,
            Boolean hasInclusion,
            Boolean hasPatch,
            Boolean hasScratch,
            Boolean hasOther,
            Pageable pageable
    ) {
        Specification<DefectDetectionResult> spec = Specification.allOf();

        if (start != null && end != null) {
            spec = spec.and((root, query, cb) ->
                    cb.between(root.get("timestamp"), start, end));
        }
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(root.get("detectConfidences"), "%" + keyword + "%"));
        }
        if (Boolean.TRUE.equals(hasInclusion)) {
            spec = spec.and((root, query, cb) -> cb.isTrue(root.get("hasInclusion")));
        }
        if (Boolean.TRUE.equals(hasPatch)) {
            spec = spec.and((root, query, cb) -> cb.isTrue(root.get("hasPatch")));
        }
        if (Boolean.TRUE.equals(hasScratch)) {
            spec = spec.and((root, query, cb) -> cb.isTrue(root.get("hasScratch")));
        }
        if (Boolean.TRUE.equals(hasOther)) {
            spec = spec.and((root, query, cb) -> cb.isTrue(root.get("hasOther")));
        }
        var result = repository.findAll(spec, pageable);
        System.out.println("Queried results: " + result);
        return result;
    }

    public DetectionResultVisionData getVisualizationData() {
        DetectionResultVisionData visionData = new DetectionResultVisionData();
        
        // Get defect type counts
        Map<String, Long> defectTypeCounts = repository.countDefectTypes();
        visionData.setDefectTypeCounts(defectTypeCounts);
        
        // Get time distribution
        List<Object[]> timeDistribution = repository.countTimeDistribution();
        Map<String, Long> timeDistMap = new HashMap<>();
        for (Object[] result : timeDistribution) {
            timeDistMap.put((String) result[0], (Long) result[1]);
        }
        visionData.setTimeDistribution(timeDistMap);
        
        // Get defect number distribution
        List<Object[]> defectNumberDistribution = repository.countDefectNumberDistribution();
        Map<Integer, Long> defectNumDistMap = new HashMap<>();
        for (Object[] result : defectNumberDistribution) {
            defectNumDistMap.put((Integer) result[0], (Long) result[1]);
        }
        visionData.setDefectNumberDistribution(defectNumDistMap);
        
        // Get daily detection counts for last 15 days
        LocalDateTime fifteenDaysAgo = LocalDateTime.now().minusDays(15);
        List<Object[]> dailyDetections = repository.countDailyDetections(fifteenDaysAgo);
        List<DetectionResultVisionData.DailyDetectionCount> dailyCounts = dailyDetections.stream()
            .map(result -> new DetectionResultVisionData.DailyDetectionCount(
                result[0].toString(), 
                (Long) result[1]
            ))
            .collect(Collectors.toList());
        visionData.setDailyDetectionCounts(dailyCounts);
        
        // Get recent defect summaries for last 15 days
        List<Object[]> recentDefects = repository.summarizeRecentDefects(fifteenDaysAgo);
        List<DetectionResultVisionData.DefectSummary> defectSummaries = recentDefects.stream()
            .map(result -> new DetectionResultVisionData.DefectSummary(
                result[0].toString(),
                (Long) result[1],
                (Long) result[2],
                (Long) result[3],
                (Long) result[4],
                (Long) result[5]
            ))
            .collect(Collectors.toList());
        visionData.setRecentDefectSummaries(defectSummaries);
        
        return visionData;
    }

}
