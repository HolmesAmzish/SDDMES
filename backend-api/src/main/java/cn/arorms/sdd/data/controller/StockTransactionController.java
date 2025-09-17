package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.StockTransaction;
import cn.arorms.sdd.data.service.StockTransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stockTransaction")
public class StockTransactionController {
    private StockTransactionService stockTransactionService;
    public StockTransactionController(StockTransactionService stockTransactionService) {
        this.stockTransactionService = stockTransactionService;
    }

    @GetMapping
    public List<StockTransaction> getAll() {
        return stockTransactionService.getAll();
    }

}
