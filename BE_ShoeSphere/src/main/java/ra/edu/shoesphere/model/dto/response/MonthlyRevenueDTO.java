package ra.edu.shoesphere.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyRevenueDTO {
    private Integer month;
    private BigDecimal revenue;
    private Long orderCount;
}
