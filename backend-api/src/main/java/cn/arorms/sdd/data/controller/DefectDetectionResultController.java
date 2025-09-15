package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.dtos.DetectionResultVisionData;
import cn.arorms.sdd.data.models.DefectDetectionResult;
import cn.arorms.sdd.data.service.DefectDetectionResultService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@RestController @RequestMapping("/api/detection")
public class DefectDetectionResultController {
    private final DefectDetectionResultService service;
    public DefectDetectionResultController(DefectDetectionResultService service) {
        this.service = service;
    }
    /**
     * 添加新的检测结果
     */
    @PostMapping("/add")
    public void addResult(@RequestBody DefectDetectionResult result) {
        service.addDefectDetectionResult(result);
    }

    @GetMapping("/query/{id}")
    public DefectDetectionResult getResultById(@PathVariable Long id) {
        return service.getDefectDetectionResultById(id);
    }

    /**
     * 分页查询 + 多条件过滤
     */
    @GetMapping("/query")
    public Page<DefectDetectionResult> queryResults(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end,

            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean hasInclusion,
            @RequestParam(required = false) Boolean hasPatch,
            @RequestParam(required = false) Boolean hasScratch,
            @RequestParam(required = false) Boolean hasOther,

            Pageable pageable
    ) {
        return service.queryResults(
                start, end, keyword,
                hasInclusion, hasPatch, hasScratch, hasOther,
                pageable
        );
    }

    /**
     * 获取可视化数据
     */
    @GetMapping("/visualization")
    public DetectionResultVisionData getVisualizationData() {
        return service.getVisualizationData();
    }
}
