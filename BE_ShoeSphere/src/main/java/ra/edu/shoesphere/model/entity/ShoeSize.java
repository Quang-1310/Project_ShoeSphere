package ra.edu.shoesphere.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shoe_sizes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoeSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shoe_id", nullable = false)
    private Shoe shoe;

    @Column(nullable = false)
    private Integer size;

    @Column(nullable = false)
    private Integer stockQuantity;
}
