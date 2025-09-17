package cn.arorms.sdd.data.models;

import cn.arorms.sdd.data.enums.MachineStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "machines")
public class Machine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "machine_name", nullable = false)
    private String machineName;

    @Column(name = "description")
    private String description;

    private MachineStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workshop_id")
    private Workshop workshop;

}
