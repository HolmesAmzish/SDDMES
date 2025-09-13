package cn.arorms.sdd.data.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Batch")
public class Batch {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_no")
    private String BatchNo;

    @Column(name = "batch_quantity")
    private double batch_quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id")
    private WorkOrder workOrder;
}
