package ra.edu.shoesphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ra.edu.shoesphere.model.entity.RefreshToken;
import ra.edu.shoesphere.model.entity.User;


import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);

    boolean existsByRefreshTokenAndRevokedFalseAndExpiredFalse(String refreshToken);

    List<RefreshToken> findByUser(User user);
}
