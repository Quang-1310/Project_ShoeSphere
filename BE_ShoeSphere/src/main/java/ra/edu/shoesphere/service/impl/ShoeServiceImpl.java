package ra.edu.shoesphere.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ra.edu.shoesphere.exception.ResourceNotFoundException;
import ra.edu.shoesphere.model.dto.response.PageResponseDTO;
import ra.edu.shoesphere.model.dto.response.ShoeResponseDTO;
import ra.edu.shoesphere.model.entity.Shoe;
import ra.edu.shoesphere.repository.ShoeRepository;
import ra.edu.shoesphere.service.ShoeService;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoeServiceImpl implements ShoeService {
    private final ShoeRepository shoeRepository;

    private static final String CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dq3ocm9yl/image/upload/";
    
    @Override

    public PageResponseDTO<ShoeResponseDTO> getAllAvailableShoes(
            String name, String brand, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {

        Page<Shoe> shoePage = shoeRepository.findShoesWithFiltersJPQL(name, brand, minPrice, maxPrice, pageable);

        List<ShoeResponseDTO> dtoList = shoePage.getContent().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        return PageResponseDTO.<ShoeResponseDTO>builder()
                .content(dtoList)
                .pageNumber(shoePage.getNumber() + 1)
                .pageSize(shoePage.getSize())
                .totalElements(shoePage.getTotalElements())
                .totalPages(shoePage.getTotalPages())
                .isLast(shoePage.isLast())
                .build();
    }

    @Override
    public ShoeResponseDTO getShoeDetailById(Long id) {
        Shoe shoe = shoeRepository.findShoeDetailJPQL(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đôi giày yêu cầu hoặc sản phẩm đã ngừng bán!"));
        return mapToResponseDTO(shoe);
    }

    private ShoeResponseDTO mapToResponseDTO(Shoe shoe) {
        String fullImageUrl = shoe.getImageUrl();
        if (fullImageUrl != null && !fullImageUrl.startsWith("http") && !fullImageUrl.isEmpty()) {
            fullImageUrl = CLOUDINARY_BASE_URL + fullImageUrl;
        }

        return ShoeResponseDTO.builder()
                .id(shoe.getId())
                .name(shoe.getName())
                .brand(shoe.getBrand())
                .description(shoe.getDescription())
                .price(shoe.getPrice())
                .sizes(shoe.getSizes() != null ? shoe.getSizes().stream()
                        .map(s -> ra.edu.shoesphere.model.dto.ShoeSizeDTO.builder()
                                .size(s.getSize())
                                .stockQuantity(s.getStockQuantity())
                                .build())
                        .collect(Collectors.toList()) : new java.util.ArrayList<>())
                .imageUrl(fullImageUrl)
                .status(shoe.getStatus())
                .build();
    }
}
