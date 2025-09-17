package cn.arorms.sdd.data.models;

import jakarta.persistence.*;

@Entity
@Table(name = "workshops")
public class Workshop {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String workshopName;

    private String location;

    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkshopName() {
        return workshopName;
    }

    public void setWorkshopName(String workshopName) {
        this.workshopName = workshopName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
