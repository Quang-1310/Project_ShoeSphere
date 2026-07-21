package ra.edu.shoesphere.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ra.edu.shoesphere.model.entity.User;
import ra.edu.shoesphere.model.entity.enums.RoleEnum;


import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE :email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    Page<User> findAllUsersWithOptionalEmail(@Param("email") String email, Pageable pageable);

    Page<User> findByStatus(Boolean status, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isDeleted = false " +
            "AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    Page<User> findCustomersWithOptionalEmail(
            @Param("role") RoleEnum role,
            @Param("email") String email,
            Pageable pageable
    );

    Optional<User> findByIdAndRoleAndIsDeletedFalse(Long id, RoleEnum role);

    Long countByRoleAndIsDeletedFalse(RoleEnum role);
}

