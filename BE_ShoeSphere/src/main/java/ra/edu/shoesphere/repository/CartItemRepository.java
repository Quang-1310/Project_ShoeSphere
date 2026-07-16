package ra.edu.shoesphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ra.edu.shoesphere.model.entity.CartItem;
import ra.edu.shoesphere.model.entity.Shoe;
import ra.edu.shoesphere.model.entity.User;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserOrderByIdDesc(User user);

    Optional<CartItem> findByUserAndShoe(User user, Shoe shoe);

    Optional<CartItem> findByIdAndUser(Long id, User user);

}