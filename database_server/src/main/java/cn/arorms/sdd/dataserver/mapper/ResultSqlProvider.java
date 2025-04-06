package cn.arorms.sdd.dataserver.mapper;

import java.util.Map;

public class ResultSqlProvider {
    public String searchResultsSql(Map<String, Object> params) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT * FROM res WHERE 1=1");

        if (params.get("name") != null && !params.get("name").toString().isEmpty()) {
            sql.append(" AND name LIKE CONCAT('%', #{name}, '%')");
        }
        if (params.get("num") != null && !params.get("num").toString().isEmpty()) {
            sql.append(" AND num = #{num}");
        }
        if (params.get("startDate") != null && !params.get("startDate").toString().isEmpty()) {
            sql.append(" AND date >= #{startDate}");
        }
        if (params.get("endDate") != null && !params.get("endDate").toString().isEmpty()) {
            sql.append(" AND date <= #{endDate}");
        }
        sql.append(" ORDER BY fig_id DESC LIMIT #{limit} OFFSET #{offset}");
        return sql.toString();
    }

    public String getFilteredCountSql(Map<String, Object> params) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT COUNT(*) FROM res WHERE 1=1");

        if (params.get("name") != null && !params.get("name").toString().isEmpty()) {
            sql.append(" AND name LIKE CONCAT('%', #{name}, '%')");
        }
        if (params.get("num") != null && !params.get("num").toString().isEmpty()) {
            sql.append(" AND num = #{num}");
        }
        if (params.get("startDate") != null && !params.get("startDate").toString().isEmpty()) {
            sql.append(" AND date >= #{startDate}");
        }
        if (params.get("endDate") != null && !params.get("endDate").toString().isEmpty()) {
            sql.append(" AND date <= #{endDate}");
        }

        return sql.toString();
    }
}
