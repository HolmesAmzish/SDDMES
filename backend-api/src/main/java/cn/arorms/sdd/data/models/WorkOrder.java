package cn.arorms.sdd.data.models;

import jakarta.persistence.*;

import java.util.List;

@Entity @Table(name = "work_orders")
public class WorkOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "work_order_no")
    private String workOrderNo;

    @Column(name = "production_quantity")
    private double productionQuantity;

    @OneToMany(mappedBy = "workOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Batch> batches;
}
