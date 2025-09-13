package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.WorkOrder;
import cn.arorms.sdd.data.repository.WorkOrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workorder")
public class WorkOrderController {
    private WorkOrderRepository workOrderRepository;
    public WorkOrderController(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    @GetMapping("/get")
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<String> addWorkOrder(@RequestBody WorkOrder workOrder) {
        workOrderRepository.save(workOrder);
        return ResponseEntity.ok("Work order added successfully");
    }
}
