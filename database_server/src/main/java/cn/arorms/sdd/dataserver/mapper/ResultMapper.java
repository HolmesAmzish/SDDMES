package cn.arorms.sdd.dataserver.mapper;

import cn.arorms.sdd.dataserver.entity.ResultEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ResultMapper {
    @Select("SELECT * FROM res LIMIT #{limit}")
    @Results({
            @Result(column = "fig_id", property = "figId"),
            @Result(column = "res_fig", property = "resFig")
    })
    List<ResultEntity> getAllResults(@Param("limit") int limit);

    @Select("SELECT * FROM res WHERE fig_id = #{figId}")
    ResultEntity getResultById(int figId);
}
