package ra.edu.shoesphere.service;

import org.springframework.data.domain.Pageable;
import ra.edu.shoesphere.model.dto.response.PageResponseDTO;
import ra.edu.shoesphere.model.dto.response.ShoeResponseDTO;


import java.math.BigDecimal;

public interface ShoeService {
    PageResponseDTO<ShoeResponseDTO> getAllAvailableShoes(
            String name, String brand, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    ShoeResponseDTO getShoeDetailById(Long id);
}
