package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    int countByWorkOrderId(Long workOrderId);

    int countByWorkOrderIdAndIsCompletedTrue(Long workOrderId);
}
