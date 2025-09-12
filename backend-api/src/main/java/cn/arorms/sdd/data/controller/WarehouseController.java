package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.Warehouse;
import cn.arorms.sdd.data.service.WarehouseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse")
public class WarehouseController {
    private WarehouseService warehouseService;
    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }
    @PostMapping("/add")
    public void addWarehouse(@RequestBody Warehouse warehouse) {
        warehouseService.add(warehouse);
    }
    @GetMapping("/get")
    public List<Warehouse> getAllWarehouses() {
        return warehouseService.getAll();
    }
}
