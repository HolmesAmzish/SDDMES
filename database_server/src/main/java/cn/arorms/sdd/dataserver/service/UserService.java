// src/main/java/cn/arorms/SDDAnalyzer/service/UserService.java
package cn.arorms.sdd.dataserver.service;

import cn.arorms.sdd.dataserver.entity.User;

public interface UserService {
    User getUserById(Integer id);
    User getUserByUsername(String username);
}