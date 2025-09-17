package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.OperationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationLogRepository extends JpaRepository<OperationLog, Long> {
}
