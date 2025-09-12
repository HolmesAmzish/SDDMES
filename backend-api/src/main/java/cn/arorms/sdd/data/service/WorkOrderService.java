package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.models.WorkOrder;
import cn.arorms.sdd.data.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderService {
    private WorkOrderRepository workOrderRepository;
    public WorkOrderService(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    public void add(WorkOrder workOrder) {
        workOrderRepository.save(workOrder);
    }

    public List<WorkOrder> getAll() {
        return workOrderRepository.findAll();
    }
}
