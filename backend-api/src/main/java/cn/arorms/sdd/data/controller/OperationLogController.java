package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.OperationLog;
import cn.arorms.sdd.data.service.OperationLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/log")
public class OperationLogController {
    private OperationLogService operationLogService;
    public OperationLogController(OperationLogService operationLogService) {
        this.operationLogService = operationLogService;
    }

    @GetMapping()
    public List<OperationLog> getAll() {
        return operationLogService.getAll();
    }
}
