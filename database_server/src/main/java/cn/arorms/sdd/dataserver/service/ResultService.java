package cn.arorms.sdd.dataserver.service;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import cn.arorms.sdd.dataserver.mapper.ResultMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling requests related to the results of the analysis.
 * @version 1.0 2025-03-12
 * @since 2025-03-12
 * @author Cacciatore`
 */
@Service
public class ResultService {
    private final ResultMapper resultMapper;

    public ResultService(ResultMapper resultMapper) {
        this.resultMapper = resultMapper;
    }

    public List<ResultEntity> getAllResults() {
        return resultMapper.getAllResults();
    }

    public ResultEntity getResultById(int figId) {
        return resultMapper.getResultById(figId);
    }
}