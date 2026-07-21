package ra.edu.shoesphere.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatisticsResponseDTO {
    private Integer selectedYear;
    private AdminDashboardSummaryDTO summary;
    private List<MonthlyRevenueDTO> monthlyRevenue;
    private List<TopSellingProductDTO> topProducts;
    private List<BrandSalesDTO> brandSales;
}
