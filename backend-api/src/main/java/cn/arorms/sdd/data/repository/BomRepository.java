package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.Bom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BomRepository extends JpaRepository<Bom, Long> {
    @Query("SELECT b FROM Bom b JOIN FETCH b.productItem")
    List<Bom> findAllWithProductItem();

    @Query("SELECT b FROM Bom b JOIN FETCH b.productItem WHERE b.id = :id")
    Optional<Bom> findByIdWithProductItem(Long id);
}
