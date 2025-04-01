// src/main/java/cn/arorms/SDDAnalyzer/entity/User.java
package cn.arorms.sdd.dataserver.entity;

import lombok.Data;

@Data
public class User {
    private Integer id;
    private String username;
    private String password;
}