package cn.arorms.sdd.data.dtos;

import cn.arorms.sdd.data.enums.ProcessStatus;
import cn.arorms.sdd.data.models.WorkOrder;

public class WorkOrderStatus {
    private String WorkOrderNo;
    private String ItemName;
    private String BomNo;
    private double processPercentage;
    private ProcessStatus Status;

    public String getWorkOrderNo() {
        return WorkOrderNo;
    }

    public void setWorkOrderNo(String workOrderNo) {
        WorkOrderNo = workOrderNo;
    }

    public String getItemName() {
        return ItemName;
    }

    public void setItemName(String itemName) {
        ItemName = itemName;
    }

    public String getBomNo() {
        return BomNo;
    }

    public void setBomNo(String bomNo) {
        BomNo = bomNo;
    }

    public double getProcessPercentage() {
        return processPercentage;
    }

    public void setProcessPercentage(double processPercentage) {
        this.processPercentage = processPercentage;
    }

    public ProcessStatus getStatus() {
        return Status;
    }

    public void setStatus(ProcessStatus status) {
        Status = status;
    }
}
