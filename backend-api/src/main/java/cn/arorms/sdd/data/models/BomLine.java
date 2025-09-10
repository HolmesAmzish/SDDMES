package cn.arorms.sdd.data.models;

import jakarta.persistence.*;

@Entity @Table(name = "bom_lines")
public class BomLine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bom_id")
    private Bom bomHeader;

    @Column(name = "line_no")
    private int lineNo;

    @Column(name = "component_item_id")
    private Long componentItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_item_id", insertable = false, updatable = false)
    private Item componentItem;

    @Column(name = "component_quantity")
    private double componentQuantity;
}
