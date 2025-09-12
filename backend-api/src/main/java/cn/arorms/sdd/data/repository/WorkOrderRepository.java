package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
}
