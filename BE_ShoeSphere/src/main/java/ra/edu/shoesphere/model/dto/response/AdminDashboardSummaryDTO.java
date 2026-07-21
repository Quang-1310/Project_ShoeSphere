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
public class AdminDashboardSummaryDTO {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalProductsSold;
    private Long totalCustomers;
    private Long pendingOrders;
    private Long confirmedOrders;
    private Long shippingOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
}
