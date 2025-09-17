package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.models.OperationLog;
import cn.arorms.sdd.data.repository.OperationLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperationLogService {
    private OperationLogRepository operationLogRepository;
    public OperationLogService(OperationLogRepository operationLogRepository) {
        this.operationLogRepository = operationLogRepository;
    }

    public List<OperationLog> getAll() {
        return operationLogRepository.findAll();
    }

    public void add(OperationLog log) {
        operationLogRepository.save(log);
    }

    public void log(String operation, String actionUrl) {
        var log = new OperationLog();
        log.setOperation(operation);
        log.setActionUrl(actionUrl);
        operationLogRepository.save(log);
    }
}
