package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
}
