package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
