package cn.arorms.sdd.data.repository;

import cn.arorms.sdd.data.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
