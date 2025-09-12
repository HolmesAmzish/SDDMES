package cn.arorms.sdd.data.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity @Table(name = "bom_lines")
public class BomLine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bom_id")
    @JsonBackReference
    private Bom bomHeader;

    @Column(name = "line_no")
    private int lineNo;

    @Column(name = "component_item_id")
    private Long componentItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_item_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Item componentItem;


    @Column(name = "component_quantity")
    private double componentQuantity;

    public BomLine() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bom getBomHeader() {
        return bomHeader;
    }

    public void setBomHeader(Bom bomHeader) {
        this.bomHeader = bomHeader;
    }

    public int getLineNo() {
        return lineNo;
    }

    public void setLineNo(int lineNo) {
        this.lineNo = lineNo;
    }

    public Long getComponentItemId() {
        return componentItemId;
    }

    public void setComponentItemId(Long componentItemId) {
        this.componentItemId = componentItemId;
    }

    public Item getComponentItem() {
        return componentItem;
    }

    public void setComponentItem(Item componentItem) {
        this.componentItem = componentItem;
    }

    public double getComponentQuantity() {
        return componentQuantity;
    }

    public void setComponentQuantity(double componentQuantity) {
        this.componentQuantity = componentQuantity;
    }
}
