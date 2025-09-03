// src/main/java/cn/arorms/SDDAnalyzer/mapper/UserMapper.java
package cn.arorms.sdd.dataserver.mapper;

import cn.arorms.sdd.dataserver.models.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(Integer id);

    @Select("SELECT * FROM users WHERE username = #{username}")
    User findByUsername(String username);
}