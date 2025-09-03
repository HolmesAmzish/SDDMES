// src/main/java/cn/arorms/SDDAnalyzer/service/impl/UserServiceImpl.java
package cn.arorms.sdd.dataserver.service.impl;

import cn.arorms.sdd.dataserver.models.User;
import cn.arorms.sdd.dataserver.mapper.UserMapper;
import cn.arorms.sdd.dataserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User getUserById(Integer id) {
        return userMapper.findById(id);
    }

    @Override
    public User getUserByUsername(String username) {
        return userMapper.findByUsername(username);
    }
}