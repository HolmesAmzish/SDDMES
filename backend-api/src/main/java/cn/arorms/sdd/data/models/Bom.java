package cn.arorms.sdd.data.models;

import jakarta.persistence.*;

import java.util.List;

@Entity @Table(name = "boms")
public class Bom {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;

    double quantity;

    @OneToMany(mappedBy = "bomHeader", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BomLine> bomLines;
}
