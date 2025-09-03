package cn.arorms.sdd.dataserver.controller;

import cn.arorms.sdd.dataserver.models.ResultEntity;
import cn.arorms.sdd.dataserver.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller class for handling requests related to the results of the analysis.
 * @version 1.3 2025-04-05
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

    @GetMapping("/getRecent")
    public List<ResultEntity> getRecentResultsFromDatabase(@RequestParam(defaultValue = "120") int limit) {
        return resultService.getRecentResults(limit);
    }

    @GetMapping("/statByDate")
    public List<Map<String, Object>> getStatisticsByDate(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        return resultService.getStatisticsByDate(startDate, endDate);
    }


    @GetMapping("/getPaginated")
    public Map<String, Object> getPaginatedResults(
            @RequestParam(defaultValue = "30") int limit,
            @RequestParam(defaultValue = "1") int page) {
        List<ResultEntity> data = resultService.getPaginatedResults(limit, page);
        int total = resultService.getTotalCount();
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("total", total);
        return response;
    }

    @GetMapping("/search")
    public Map<String, Object> searchResults(
        @RequestParam(defaultValue = "30") int limit,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(required = false) String name,
        @RequestParam(required = false) Integer num,
        @RequestParam(required = false) String startDate,
        @RequestParam(required = false) String endDate,
        @RequestParam(required = false) String label
    ) {
        List<ResultEntity> data = resultService.searchResults(limit, page, name, num, startDate, endDate, label);
        int total = resultService.getFilteredCount(name, num, startDate, endDate, label);
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("total", total);
        return response;
    }


    @PostMapping("/insert")
    public void insertResults(@RequestBody List<ResultEntity> results) {
        resultService.insertResults(results);
    }

    @GetMapping(value = "/getResFig", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getResultFigure(@RequestParam int id) {
        ResultEntity result = resultService.getResultById(id);
        if (result == null || result.getResFig() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(result.getResFig());
    }
}