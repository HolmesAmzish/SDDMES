package cn.arorms.sdd.data.models;

import cn.arorms.sdd.data.enums.StockTransactionType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity @Table(name = "stock_transactions")
public class StockTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private StockTransactionType transactionType;

    @Column(name = "quantity", nullable = false)
    private double quantity;

    @ManyToOne()
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne()
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne()
    @JoinColumn(name = "created_by")
    private User creator;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    /**
     * Optional Attributes
     */
    @OneToOne()
    @JoinColumn(name = "batch_id", nullable = true)
    private Batch batch;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StockTransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(StockTransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Batch getBatch() {
        return batch;
    }

    public void setBatch(Batch batch) {
        this.batch = batch;
    }

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
