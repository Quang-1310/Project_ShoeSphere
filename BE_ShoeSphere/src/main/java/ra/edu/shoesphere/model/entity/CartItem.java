package ra.edu.shoesphere.model.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name="cart_items", uniqueConstraints=@UniqueConstraint(columnNames={"user_id","shoe_id","size"}))
@Getter
@Setter
@NoArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name="user_id")
    private User user; @ManyToOne @JoinColumn(name="shoe_id")
    private Shoe shoe;
    private Integer size;
    private Integer quantity;
}
