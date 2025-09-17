package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.dtos.WorkOrderStatus;
import cn.arorms.sdd.data.enums.ProcessStatus;
import cn.arorms.sdd.data.models.WorkOrder;
import cn.arorms.sdd.data.repository.OperationLogRepository;
import cn.arorms.sdd.data.repository.WorkOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderService {
    private final WorkOrderRepository workOrderRepository;
    private final BatchService batchService;
    private final OperationLogService operationLogService;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            BatchService batchService,
            OperationLogService operationLogService
    ) {
        this.workOrderRepository = workOrderRepository;
        this.batchService = batchService;
        this.operationLogService = operationLogService;
    }

    public void add(WorkOrder workOrder) {
        operationLogService.log("系统更新了工单", "/workorder");
        workOrderRepository.save(workOrder);
    }

    public void update(WorkOrder workOrder) {
        workOrderRepository.save(workOrder);
    }

    public List<WorkOrder> getAll() {
        return workOrderRepository.findAll();
    }

    public void deleteById(Long id) {
        workOrderRepository.deleteById(id);
    }

    public void updateStatus(Long id, String status) {
        var workOrderOpt = workOrderRepository.findById(id);
        if (workOrderOpt.isPresent()) {
            var wo = workOrderOpt.get();
            wo.setStatus(ProcessStatus.valueOf(status));
            workOrderRepository.save(wo);
        } else {
            throw new RuntimeException("Work order not found with id: " + id);
        }
    }

    public Page<WorkOrderStatus> getAllStatuses(Pageable pageable) {
        if (pageable == null) {
            pageable = Pageable.ofSize(10);
        }

        Page<WorkOrder> workOrders = workOrderRepository.findAll(pageable);

        List<WorkOrderStatus> statusList = workOrders.stream().map(workOrder -> {
            int completed = batchService.countCompletedByWorkOrderId(workOrder.getId());
            int total = batchService.countByWorkOrderId(workOrder.getId());
            double process = total == 0 ? 0.0 : (double) completed / total;

            WorkOrderStatus dto = new WorkOrderStatus();
            dto.setWorkOrderNo(workOrder.getWorkOrderNo());
            dto.setItemName(workOrder.getProductItem() != null ? workOrder.getProductItem().getName() : null);
            dto.setBomNo(workOrder.getBom() != null ? workOrder.getBom().getId().toString() : null);
            dto.setProcessPercentage(process);
            dto.setStatus(workOrder.getStatus());
            return dto;
        }).toList();

        return new PageImpl<>(statusList, pageable, workOrders.getTotalElements());
    }
}
