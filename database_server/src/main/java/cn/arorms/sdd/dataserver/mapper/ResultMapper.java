package cn.arorms.sdd.dataserver.mapper;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ResultMapper {
    @Select("SELECT * FROM res LIMIT 120")
    @Results({
            @Result(column = "fig_id", property = "figId"),
            @Result(column = "res_fig", property = "resFig")
    })
    List<ResultEntity> getAllResults();

    @Select("SELECT * FROM res WHERE fig_id = #{figId}")
    ResultEntity getResultById(int figId);
}
