package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.WorkOrder;
import jakarta.annotation.Nonnull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Repository interface for WorkOrder entities.
 * @version 1.0 2025-09-13
 * @author Cacciatore
 */
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    @Query("""
       SELECT w FROM WorkOrder w
       LEFT JOIN FETCH w.productItem
       LEFT JOIN FETCH w.bom b
       LEFT JOIN FETCH b.productItem
       """)
    List<WorkOrder> findAll();

}
