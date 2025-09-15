package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.DefectDetectionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Repository interface for DefectDetectionResult entities.
 */
public interface DefectDetectionResultRepository
        extends JpaRepository<DefectDetectionResult, Long>,
        JpaSpecificationExecutor<DefectDetectionResult> {

    @Query("SELECT " +
           "SUM(CASE WHEN d.hasInclusion = true THEN 1 ELSE 0 END) as inclusion, " +
           "SUM(CASE WHEN d.hasPatch = true THEN 1 ELSE 0 END) as patch, " +
           "SUM(CASE WHEN d.hasScratch = true THEN 1 ELSE 0 END) as scratch, " +
           "SUM(CASE WHEN d.hasOther = true THEN 1 ELSE 0 END) as other " +
           "FROM DefectDetectionResult d")
    Map<String, Long> countDefectTypes();

    @Query("SELECT " +
           "CASE " +
           "WHEN d.timeCost < 1 THEN '<1s' " +
           "WHEN d.timeCost BETWEEN 1 AND 2 THEN '1-2s' " +
           "WHEN d.timeCost BETWEEN 2 AND 5 THEN '2-5s' " +
           "WHEN d.timeCost BETWEEN 5 AND 10 THEN '5-10s' " +
           "ELSE '>10s' " +
           "END as timeRange, " +
           "COUNT(d) as count " +
           "FROM DefectDetectionResult d " +
           "GROUP BY timeRange")
    List<Object[]> countTimeDistribution();

    @Query("SELECT d.defectNumber, COUNT(d) " +
           "FROM DefectDetectionResult d " +
           "GROUP BY d.defectNumber " +
           "ORDER BY d.defectNumber")
    List<Object[]> countDefectNumberDistribution();

    @Query("SELECT FUNCTION('DATE', d.timestamp) as date, COUNT(d) " +
           "FROM DefectDetectionResult d " +
           "WHERE d.timestamp >= :startDate " +
           "GROUP BY FUNCTION('DATE', d.timestamp) " +
           "ORDER BY date DESC")
    List<Object[]> countDailyDetections(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT FUNCTION('DATE', d.timestamp) as date, " +
           "SUM(d.defectNumber) as totalDefects, " +
           "SUM(CASE WHEN d.hasInclusion = true THEN 1 ELSE 0 END) as inclusionCount, " +
           "SUM(CASE WHEN d.hasPatch = true THEN 1 ELSE 0 END) as patchCount, " +
           "SUM(CASE WHEN d.hasScratch = true THEN 1 ELSE 0 END) as scratchCount, " +
           "SUM(CASE WHEN d.hasOther = true THEN 1 ELSE 0 END) as otherCount " +
           "FROM DefectDetectionResult d " +
           "WHERE d.timestamp >= :startDate " +
           "GROUP BY FUNCTION('DATE', d.timestamp) " +
           "ORDER BY date DESC")
    List<Object[]> summarizeRecentDefects(@Param("startDate") LocalDateTime startDate);
}
