package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.DefectDetectionResult;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for DefectDetectionResult entities.
 */
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DefectDetectionResultRepository
        extends JpaRepository<DefectDetectionResult, Long>,
        JpaSpecificationExecutor<DefectDetectionResult> {
}
