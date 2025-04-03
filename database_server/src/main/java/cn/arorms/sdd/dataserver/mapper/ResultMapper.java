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

    @Insert({
            "<script>",
            "INSERT INTO res (name, res_fig, time, label, num, dice) VALUES ",
            "<foreach collection='list' item='item' separator=','>",
            "(#{item.name}, #{item.resFig}, #{item.time}, #{item.label}, #{item.num}, #{item.dice})",
            "</foreach>",
            "</script>"
    })
    void insertResults(@Param("list") List<ResultEntity> results);

    @Select("SELECT * FROM res WHERE fig_id = #{figId}")
    @Results({
            @Result(column = "fig_id", property = "figId"),
            @Result(column = "res_fig", property = "resFig")
    })
    ResultEntity getResultById(int figId);
}