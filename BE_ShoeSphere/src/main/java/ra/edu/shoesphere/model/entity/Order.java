package ra.edu.shoesphere.model.entity;

import jakarta.persistence.*;
import lombok.*;
import ra.edu.shoesphere.model.entity.enums.OrderStatus;

import java.math.*;
import java.time.*;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String receiverName;

    private String receiverPhone;

    private String deliveryAddress;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    @PrePersist
    void create() {
        createdAt = LocalDateTime.now();
    }

}