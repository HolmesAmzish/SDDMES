package cn.arorms.sdd.dataserver.controller;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import cn.arorms.sdd.dataserver.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class for handling requests related to the results of the analysis.
 * @version 1.0 2025-03-12
 * @since 2025-03-12
 * @author Cacciatore
 */
@RestController
@RequestMapping("/api/data")
public class ResultController {

    @Autowired
    private ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    /**
     * Fetches data from the database by the limits
     * @param limit: the limit number of database records
     * @return List<ResultEntity>: List of ResultEntity objects
     */
    @GetMapping("/getAll")
    public List<ResultEntity> getAllResultsFromDatabase(@RequestParam(defaultValue = "120") int limit) {
        return resultService.getAllResults(limit);
    }

    /**
     * Insert a list of result into database
     * @param results: the List of ResultEntity
     */
    @PostMapping("/insert")
    public void insertResults(@RequestBody List<ResultEntity> results) {
        resultService.insertResults(results);
    }

}
