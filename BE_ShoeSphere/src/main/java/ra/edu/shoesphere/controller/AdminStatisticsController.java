package ra.edu.shoesphere.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ra.edu.shoesphere.model.dto.response.ApiDataResponse;
import ra.edu.shoesphere.model.dto.response.AdminStatisticsResponseDTO;
import ra.edu.shoesphere.service.AdminStatisticsService;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminStatisticsController {

    private final AdminStatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<ApiDataResponse<AdminStatisticsResponseDTO>> getStatistics(
            @RequestParam(required = false) Integer year) {
        
        AdminStatisticsResponseDTO statistics = statisticsService.getAdminStatistics(year);

        ApiDataResponse<AdminStatisticsResponseDTO> response = new ApiDataResponse<>(
                true,
                "Lấy dữ liệu thống kê quản trị thành công",
                statistics,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }
}
