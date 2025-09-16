package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.dtos.WorkOrderStatus;
import cn.arorms.sdd.data.models.WorkOrder;
import cn.arorms.sdd.data.service.WorkOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workorder")
public class WorkOrderController {
    private final WorkOrderService workOrderService;

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

    @PostMapping("/updateStatus")
    public ResponseEntity<String> updateWorkOrderStatus(@RequestParam Long id, @RequestParam String status) {
        workOrderService.updateStatus(id, status);
        return ResponseEntity.ok("Work order status updated successfully");
    }

    @GetMapping("/getStatuses")
    public Page<WorkOrderStatus> getWorkOrderStatuses(Pageable pageable) {
        return workOrderService.getAllStatuses(pageable);
    }
}
