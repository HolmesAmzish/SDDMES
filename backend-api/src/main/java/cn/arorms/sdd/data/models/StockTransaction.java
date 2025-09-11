package cn.arorms.sdd.data.models;

import cn.arorms.sdd.data.enums.StockTransactionType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity @Table(name = "stock_entries")
public class StockTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private StockTransactionType transactionType;

    @Column(name = "quantity", nullable = false)
    private double quantity;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User creator;

    /**
     * Optional Attributes
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = true)
    private Batch batch;
}
