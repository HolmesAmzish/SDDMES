package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
}
