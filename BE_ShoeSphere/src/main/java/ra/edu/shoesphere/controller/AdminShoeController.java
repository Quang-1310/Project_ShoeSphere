package ra.edu.shoesphere.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ra.edu.shoesphere.model.dto.request.ShoeRequestDTO;
import ra.edu.shoesphere.model.dto.response.ApiDataResponse;
import ra.edu.shoesphere.model.dto.response.PageResponseDTO;
import ra.edu.shoesphere.model.dto.response.ShoeResponseDTO;
import ra.edu.shoesphere.service.AdminShoeService;
import ra.edu.shoesphere.service.ShoeService;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/shoes")
@PreAuthorize("hasRole('ADMIN')") // Chặn quyền tuyệt đối từ đầu ngõ Controller
public class AdminShoeController {

    @Autowired
    private AdminShoeService adminShoeService;

    @Autowired
    private ShoeService shoeService;

    // 1. READ ALL (Hỗ trợ phân trang, tìm kiếm)
    @GetMapping
    public ResponseEntity<ApiDataResponse<PageResponseDTO<ShoeResponseDTO>>> getAllShoes(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        String searchName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String searchBrand = (brand != null && !brand.trim().isEmpty()) ? brand.trim() : null;

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        PageResponseDTO<ShoeResponseDTO> shoes = shoeService.getAllAvailableShoes(searchName, searchBrand, minPrice, maxPrice, pageable);

        ApiDataResponse<PageResponseDTO<ShoeResponseDTO>> response = new ApiDataResponse<>(
                true,
                "Lấy danh sách sản phẩm admin thành công!",
                shoes,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }

    // 2. READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiDataResponse<ShoeResponseDTO>> getShoeById(@PathVariable Long id) {
        ShoeResponseDTO shoe = shoeService.getShoeDetailById(id);

        ApiDataResponse<ShoeResponseDTO> response = new ApiDataResponse<>(
                true,
                "Lấy chi tiết sản phẩm thành công!",
                shoe,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }

    // 3. CREATE NEW SHOE (Đăng ký ảnh lên Cloudinary)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiDataResponse<ShoeResponseDTO>> createShoe(
            @RequestPart("shoe") @Valid ShoeRequestDTO request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        ShoeResponseDTO createdShoe = adminShoeService.createShoe(request, image);

        ApiDataResponse<ShoeResponseDTO> response = new ApiDataResponse<>(
                true,
                "Thêm sản phẩm giày mới thành công!",
                createdShoe,
                null,
                HttpStatus.CREATED
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 4. UPDATE SHOE (Hỗ trợ đổi ảnh hoặc giữ nguyên ảnh cũ)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiDataResponse<ShoeResponseDTO>> updateShoe(
            @PathVariable Long id,
            @RequestPart("shoe") @Valid ShoeRequestDTO request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        ShoeResponseDTO updatedShoe = adminShoeService.updateShoe(id, request, image);

        ApiDataResponse<ShoeResponseDTO> response = new ApiDataResponse<>(
                true,
                "Cập nhật sản phẩm thành công!",
                updatedShoe,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }

    // 5. DELETE (Xóa mềm - Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiDataResponse<Void>> deleteShoe(@PathVariable Long id) {
        adminShoeService.softDeleteShoe(id);

        ApiDataResponse<Void> response = new ApiDataResponse<>(
                true,
                "Xóa mềm sản phẩm thành công!",
                null,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }
}