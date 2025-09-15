package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.WorkOrder;
import cn.arorms.sdd.data.repository.WorkOrderRepository;
import cn.arorms.sdd.data.service.WorkOrderService;
import org.hibernate.jdbc.Work;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workorder")
public class WorkOrderController {
    private WorkOrderService workOrderService;
    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @GetMapping("/get")
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<String> addWorkOrder(@RequestBody WorkOrder workOrder) {
        workOrderService.add(workOrder);
        return ResponseEntity.ok("Work order added successfully");
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteWorkOrder(@RequestParam Long id) {
        workOrderService.deleteById(id);
        return ResponseEntity.ok("Work order deleted successfully");
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateWorkOrder(@RequestBody WorkOrder workOrder) {
        workOrderService.update(workOrder);
        return ResponseEntity.ok("Work order updated successfully");
    }
}
