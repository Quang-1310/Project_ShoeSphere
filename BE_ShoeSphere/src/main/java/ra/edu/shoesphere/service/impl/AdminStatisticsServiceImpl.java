package ra.edu.shoesphere.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ra.edu.shoesphere.model.dto.response.*;
import ra.edu.shoesphere.model.entity.enums.OrderStatus;
import ra.edu.shoesphere.model.entity.enums.RoleEnum;
import ra.edu.shoesphere.repository.OrderItemRepository;
import ra.edu.shoesphere.repository.OrderRepository;
import ra.edu.shoesphere.repository.UserRepository;
import ra.edu.shoesphere.service.AdminStatisticsService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    @Override
    public AdminStatisticsResponseDTO getAdminStatistics(Integer year) {
        int targetYear = (year != null && year > 2000) ? year : LocalDate.now().getYear();

        // 1. Calculate KPI Summary
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        Long totalOrders = orderRepository.count();
        Long totalProductsSold = orderItemRepository.sumTotalProductsSold();
        if (totalProductsSold == null) {
            totalProductsSold = 0L;
        }

        Long totalCustomers = userRepository.countByRoleAndIsDeletedFalse(RoleEnum.CUSTOMER);
        if (totalCustomers == null) {
            totalCustomers = 0L;
        }

        Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING_CONFIRMATION);
        Long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        
        Long packedCount = orderRepository.countByStatus(OrderStatus.PACKED);
        Long pickedUpCount = orderRepository.countByStatus(OrderStatus.PICKED_UP);
        Long shippingCount = orderRepository.countByStatus(OrderStatus.SHIPPING);
        Long totalShippingOrders = (packedCount != null ? packedCount : 0L)
                + (pickedUpCount != null ? pickedUpCount : 0L)
                + (shippingCount != null ? shippingCount : 0L);

        Long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        Long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        AdminDashboardSummaryDTO summary = AdminDashboardSummaryDTO.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders != null ? totalOrders : 0L)
                .totalProductsSold(totalProductsSold)
                .totalCustomers(totalCustomers)
                .pendingOrders(pendingOrders != null ? pendingOrders : 0L)
                .confirmedOrders(confirmedOrders != null ? confirmedOrders : 0L)
                .shippingOrders(totalShippingOrders)
                .deliveredOrders(deliveredOrders != null ? deliveredOrders : 0L)
                .cancelledOrders(cancelledOrders != null ? cancelledOrders : 0L)
                .build();

        // 2. Build 12 Months Revenue Data
        List<Object[]> monthlyRaw = orderRepository.getMonthlyRevenueByYear(targetYear);
        Map<Integer, MonthlyRevenueDTO> monthlyMap = new HashMap<>();

        for (Object[] row : monthlyRaw) {
            if (row != null && row.length >= 3) {
                Integer m = (Integer) row[0];
                BigDecimal rev = row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO;
                Long count = row[2] != null ? ((Number) row[2]).longValue() : 0L;
                monthlyMap.put(m, new MonthlyRevenueDTO(m, rev, count));
            }
        }

        List<MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            if (monthlyMap.containsKey(m)) {
                monthlyRevenue.add(monthlyMap.get(m));
            } else {
                monthlyRevenue.add(new MonthlyRevenueDTO(m, BigDecimal.ZERO, 0L));
            }
        }

        // 3. Top Best-Selling Products (Top 10)
        List<Object[]> topRaw = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 10));
        List<TopSellingProductDTO> topProducts = topRaw.stream().map(row -> {
            Long shoeId = row[0] != null ? ((Number) row[0]).longValue() : null;
            String shoeName = row[1] != null ? row[1].toString() : "Chưa rõ";
            String imageUrl = row[2] != null ? row[2].toString() : null;
            String brand = row[3] != null ? row[3].toString() : "Khác";
            BigDecimal price = row[4] != null ? (BigDecimal) row[4] : BigDecimal.ZERO;
            Long quantitySold = row[5] != null ? ((Number) row[5]).longValue() : 0L;
            BigDecimal productRevenue = row[6] != null ? (BigDecimal) row[6] : BigDecimal.ZERO;

            return TopSellingProductDTO.builder()
                    .shoeId(shoeId)
                    .shoeName(shoeName)
                    .imageUrl(imageUrl)
                    .brand(brand)
                    .price(price)
                    .totalQuantitySold(quantitySold)
                    .totalRevenue(productRevenue)
                    .build();
        }).collect(Collectors.toList());

        // 4. Sales performance by Brand
        List<Object[]> brandRaw = orderItemRepository.findSalesByBrand();
        List<BrandSalesDTO> brandSales = brandRaw.stream().map(row -> {
            String brandName = row[0] != null ? row[0].toString() : "Khác";
            Long quantitySold = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            BigDecimal brandRevenue = row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO;

            return BrandSalesDTO.builder()
                    .brand(brandName)
                    .totalQuantitySold(quantitySold)
                    .totalRevenue(brandRevenue)
                    .build();
        }).collect(Collectors.toList());

        return AdminStatisticsResponseDTO.builder()
                .selectedYear(targetYear)
                .summary(summary)
                .monthlyRevenue(monthlyRevenue)
                .topProducts(topProducts)
                .brandSales(brandSales)
                .build();
    }
}
