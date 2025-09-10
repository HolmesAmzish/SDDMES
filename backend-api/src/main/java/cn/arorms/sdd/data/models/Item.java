package cn.arorms.sdd.data.models;

import cn.arorms.sdd.data.enums.ItemType;
import jakarta.persistence.*;

@Entity @Table(name = "items")
public class Item {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "item_type")
    @Enumerated(EnumType.STRING)
    private ItemType itemType;

    @Column(name = "unit")
    private String unit;
}
