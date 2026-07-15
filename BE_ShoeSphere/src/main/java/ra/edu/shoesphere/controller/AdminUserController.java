package ra.edu.shoesphere.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ra.edu.shoesphere.model.dto.response.ApiDataResponse;
import ra.edu.shoesphere.model.dto.response.PageResponseDTO;
import ra.edu.shoesphere.model.dto.response.UserResponseDTO;
import ra.edu.shoesphere.service.UserService;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiDataResponse<PageResponseDTO<UserResponseDTO>>> getCustomers(
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserResponseDTO> customers = userService.getCustomers(page, size, email);
        PageResponseDTO<UserResponseDTO> data = PageResponseDTO.<UserResponseDTO>builder()
                .content(customers.getContent())
                .pageNumber(customers.getNumber() + 1)
                .pageSize(customers.getSize())
                .totalElements(customers.getTotalElements())
                .totalPages(customers.getTotalPages())
                .isLast(customers.isLast())
                .build();

        return ResponseEntity.ok(new ApiDataResponse<>(
                true, "Customer accounts retrieved successfully.", data, null, HttpStatus.OK
        ));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiDataResponse<UserResponseDTO>> toggleCustomerStatus(@PathVariable Long id) {
        UserResponseDTO customer = userService.toggleCustomerStatus(id);
        return ResponseEntity.ok(new ApiDataResponse<>(
                true, "Customer account status updated.", customer, null, HttpStatus.OK
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiDataResponse<Void>> deleteCustomer(@PathVariable Long id) {
        userService.softDeleteCustomer(id);
        return ResponseEntity.ok(new ApiDataResponse<>(
                true, "Customer account deleted.", null, null, HttpStatus.OK
        ));
    }
}
