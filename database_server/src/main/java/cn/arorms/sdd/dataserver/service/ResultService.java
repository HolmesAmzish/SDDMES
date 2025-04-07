package cn.arorms.sdd.dataserver.service;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import cn.arorms.sdd.dataserver.mapper.ResultMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Service class for handling requests related to the results of the analysis.
 * @version 1.4 2025-04-05
 * @since 2025-03-12
 * @author Cacciatore
 */
@Service
public class ResultService {
    private final ResultMapper resultMapper;

    public ResultService(ResultMapper resultMapper) {
        this.resultMapper = resultMapper;
    }

    public List<ResultEntity> getRecentResults(int limit) {
        return resultMapper.getRecentResults(limit);
    }

    public List<Map<String, Object>> getStatisticsByDate(String startDate, String endDate) {
        // 默认值：从今天起前15天
        if (startDate == null || endDate == null) {
            LocalDate end = LocalDate.now();
            LocalDate start = end.minusDays(15);
            startDate = start.toString();
            endDate = end.toString();
        }

        return resultMapper.getStatisticsByDate(startDate, endDate);
    }


    public List<ResultEntity> getPaginatedResults(int limit, int page) {
        int offset = (page - 1) * limit;
        return resultMapper.getPaginatedResults(limit, offset);
    }

    public List<ResultEntity> searchResults(int limit, int page, String name, Integer num, String startDate, String endDate) {
        int offset = (page - 1) * limit;
        return resultMapper.searchResults(limit, offset, name, num, startDate, endDate);
    }

    public void insertResults(List<ResultEntity> results) {
        resultMapper.insertResults(results);
    }

    public ResultEntity getResultById(int figId) {
        return resultMapper.getResultById(figId);
    }

    public int getFilteredCount(String name, Integer num, String startDate, String endDate) {
        return resultMapper.getFilteredCount(name, num, startDate, endDate);
    }

    public int getTotalCount() {
        return resultMapper.getTotalCount();
    }

    // 新增方法：获取指定日期范围的数据
    public List<ResultEntity> getResultsInDateRange(String startDate, String endDate) {
        return resultMapper.searchResults(Integer.MAX_VALUE, 1, null, null, startDate, endDate);
    }
}