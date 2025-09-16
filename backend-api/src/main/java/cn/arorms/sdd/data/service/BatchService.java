package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.models.Batch;
import cn.arorms.sdd.data.repository.BatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BatchService {
    private BatchRepository batchRepository;
    public BatchService(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    public Batch save(Batch batch) {
        return batchRepository.save(batch);
    }
    public void delete(Batch batch) {
        batchRepository.delete(batch);
    }
    public void update(Batch batch) {
        batchRepository.save(batch);
    }
    public Batch getById(Long id) {
        return batchRepository.findById(id).orElse(null);
    }
    public List<Batch> getAll() {
        return batchRepository.findAll();
    }

    public int countByWorkOrderId(Long workOrderId) {
        return batchRepository.countByWorkOrderId(workOrderId);
    }

    public int countCompletedByWorkOrderId(Long workOrderId) {
        return batchRepository.countByWorkOrderIdAndIsCompletedTrue(workOrderId);
    }
}
