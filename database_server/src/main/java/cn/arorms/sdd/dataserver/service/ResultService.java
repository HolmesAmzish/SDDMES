package cn.arorms.sdd.dataserver.service;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import cn.arorms.sdd.dataserver.mapper.ResultMapper;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<ResultEntity> getAllResults(int limit) {
        return resultMapper.getAllResults(limit);
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

}