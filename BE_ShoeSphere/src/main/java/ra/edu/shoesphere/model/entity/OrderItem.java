package ra.edu.shoesphere.model.entity;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal;
@Entity @Table(name="order_items") @Getter @Setter @NoArgsConstructor public class OrderItem { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne @JoinColumn(name="order_id") private Order order; @ManyToOne private Shoe shoe; private String shoeName; private BigDecimal unitPrice; private Integer quantity; }
