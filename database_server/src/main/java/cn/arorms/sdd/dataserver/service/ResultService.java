package cn.arorms.sdd.dataserver.service;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import cn.arorms.sdd.dataserver.mapper.ResultMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling requests related to the results of the analysis.
 * @version 1.1 2025-04-02
 * @since 2025-03-12
 * @author Cacciatore`
 */
@Service
public class ResultService {
    private final ResultMapper resultMapper;

    public ResultService(ResultMapper resultMapper) {
        this.resultMapper = resultMapper;
    }

    /**
     * Fetch specific number of records from MySQL
     * @param limit the number of records to fetch
     * @return List of ResultEntity
     */
    public List<ResultEntity> getAllResults(int limit) {
        return resultMapper.getAllResults(limit);
    }

    /**
     * Insert a list of result into database
     * @param results List of ResultEntity
     */
    public void insertResults(List<ResultEntity> results) {
        resultMapper.insertResults(results);
    }

    public ResultEntity getResultById(int figId) {
        return resultMapper.getResultById(figId);
    }
}