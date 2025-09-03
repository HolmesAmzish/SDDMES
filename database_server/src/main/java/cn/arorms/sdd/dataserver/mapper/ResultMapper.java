package cn.arorms.sdd.dataserver.mapper;

import cn.arorms.sdd.dataserver.models.ResultEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

/**
 * ResultMapper
 * @version 1.3 2025-04-05
 * @since 2025-03-12
 * @author Holmes Amzish
 */
@Mapper
public interface ResultMapper {

    // Fetch specific number of result list
    @Select("SELECT label, num, time FROM res ORDER BY date DESC LIMIT #{limit}")
    @Results({
            @Result(property = "figId", column = "fig_id") // Mapping fig_id to figId
    })
    List<ResultEntity> getRecentResults(@Param("limit") int limit);

    @SelectProvider(type = ResultSqlProvider.class, method = "getStatisticsByDateSql")
    List<Map<String, Object>> getStatisticsByDate(@Param("startDate") String startDate, @Param("endDate") String endDate);


    /**
     * A simple api that fetch results by pages
     * @param limit: number of results displayed in every page
     * @param offset: to calculate the page number
     * @return List<ResultEntity>
     */
    @Select("SELECT * FROM res ORDER BY fig_id DESC LIMIT #{limit} OFFSET #{offset}")
    @Results({
            @Result(property = "figId", column = "fig_id") // Mapping fig_id to figId
    })
    List<ResultEntity> getPaginatedResults(@Param("limit") int limit, @Param("offset") int offset);

    // Insert results into database from detection page
    @Insert({
            "<script>",
            "INSERT INTO res (name, res_fig, time, label, num, dice) VALUES ",
            "<foreach collection='list' item='item' separator=','>",
            "(#{item.name}, #{item.resFig}, #{item.time}, #{item.label}, #{item.num}, #{item.dice})",
            "</foreach>",
            "</script>"
    })
    void insertResults(@Param("list") List<ResultEntity> results);

    // Get result by figure id
    @Select("SELECT * FROM res WHERE fig_id = #{figId}")
    @Results({
            // Mapping
            @Result(property = "figId", column = "fig_id"),
            @Result(property = "resFig", column = "res_fig")
    })
    ResultEntity getResultById(@Param("figId") int figId);

    // Count the number of result records in database
    @Select("SELECT COUNT(*) FROM res")
    int getTotalCount();

    // Search results with dynamic conditions
    @SelectProvider(type = ResultSqlProvider.class, method = "searchResultsSql")
    @Results({
            @Result(property = "figId", column = "fig_id"), // Mapping fig_id to figId
    })
    List<ResultEntity> searchResults(
            @Param("limit") int limit,
            @Param("offset") int offset,
            @Param("name") String name,
            @Param("num") Integer num,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("label") String label
    );

    // Count the filtered results
    @SelectProvider(type = ResultSqlProvider.class, method = "getFilteredCountSql")
    int getFilteredCount(
            @Param("name") String name,
            @Param("num") Integer num,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("label") String label
    );
}


