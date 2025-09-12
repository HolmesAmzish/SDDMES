package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.models.Warehouse;
import cn.arorms.sdd.data.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {
    private WarehouseRepository warehouseRepository;
    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public void add(Warehouse warehouse) {
        warehouseRepository.save(warehouse);
    }

    public List<Warehouse> getAll() {
        return warehouseRepository.findAll();
    }

    public void delete(Long id) {
        warehouseRepository.deleteById(id);
    }
}
