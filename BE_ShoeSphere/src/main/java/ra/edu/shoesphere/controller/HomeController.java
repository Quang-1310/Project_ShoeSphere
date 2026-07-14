package ra.edu.shoesphere.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ra.edu.shoesphere.model.dto.response.ApiDataResponse;
import ra.edu.shoesphere.model.dto.response.PageResponseDTO;
import ra.edu.shoesphere.model.dto.response.ShoeResponseDTO;
import ra.edu.shoesphere.service.ShoeService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/shoes")
@RequiredArgsConstructor
public class HomeController {

    private final ShoeService shoeService;

    @GetMapping
    public ResponseEntity<ApiDataResponse<PageResponseDTO<ShoeResponseDTO>>> getAllShoes(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {

        String searchName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String searchBrand = (brand != null && !brand.trim().isEmpty()) ? brand.trim() : null;

        int pageIndex = page - 1;
        if (pageIndex < 0) pageIndex = 0;

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageIndex, size, sort);

        PageResponseDTO<ShoeResponseDTO> paginatedShoes =
                shoeService.getAllAvailableShoes(searchName, searchBrand, minPrice, maxPrice, pageable);

        ApiDataResponse<PageResponseDTO<ShoeResponseDTO>> response = new ApiDataResponse<>(
                true,
                "Lấy danh sách sản phẩm thành công!",
                paginatedShoes,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiDataResponse<ShoeResponseDTO>> getShoeDetail(@PathVariable Long id) {
        ShoeResponseDTO shoeDetail = shoeService.getShoeDetailById(id);

        ApiDataResponse<ShoeResponseDTO> response = new ApiDataResponse<>(
                true,
                "Lấy thông tin chi tiết sản phẩm thành công!",
                shoeDetail,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }
}
