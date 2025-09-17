package cn.arorms.sdd.data.service;

import cn.arorms.sdd.data.models.StockTransaction;
import cn.arorms.sdd.data.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockTransactionService {
    private StockTransactionRepository stockTransactionRepository;
    public StockTransactionService(StockTransactionRepository stockTransactionRepository) {
        this.stockTransactionRepository = stockTransactionRepository;
    }

    public void add(StockTransaction stockTransaction) {
        stockTransactionRepository.save(stockTransaction);
    }

    public List<StockTransaction> getAll() {
        return stockTransactionRepository.findAll();
    }
}
