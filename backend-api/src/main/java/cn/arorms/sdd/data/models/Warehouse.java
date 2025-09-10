package cn.arorms.sdd.data.models;

import jakarta.persistence.*;

@Entity @Table(name = "warehouses")
public class Warehouse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_name", unique = true, nullable = false)
    private String warehouseName;
}
