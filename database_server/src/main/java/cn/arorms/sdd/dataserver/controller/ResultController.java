package cn.arorms.sdd.dataserver.controller;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import cn.arorms.sdd.dataserver.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping("/getAll")
    public List<ResultEntity> getAllResultsFromDatabase() {
        return resultService.getAllResults();
    }

}
