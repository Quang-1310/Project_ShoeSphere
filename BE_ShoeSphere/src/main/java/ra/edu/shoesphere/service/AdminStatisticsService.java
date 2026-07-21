package ra.edu.shoesphere.service;

import ra.edu.shoesphere.model.dto.response.AdminStatisticsResponseDTO;

public interface AdminStatisticsService {
    AdminStatisticsResponseDTO getAdminStatistics(Integer year);
}
