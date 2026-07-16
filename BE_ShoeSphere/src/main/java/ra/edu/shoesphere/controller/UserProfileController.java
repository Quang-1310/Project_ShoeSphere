package ra.edu.shoesphere.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ra.edu.shoesphere.model.dto.request.DeliveryInfoRequestDTO;
import ra.edu.shoesphere.model.dto.response.ApiDataResponse;
import ra.edu.shoesphere.model.dto.response.UserResponseDTO;
import ra.edu.shoesphere.service.UserService;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserService userService;

    @PutMapping("/delivery-info")
    public ResponseEntity<ApiDataResponse<UserResponseDTO>> updateDeliveryInfo(
            Authentication authentication,
            @Valid @RequestBody DeliveryInfoRequestDTO request
    ) {
        UserResponseDTO user = userService.updateMyDeliveryInfo(authentication.getName(), request);
        return ResponseEntity.ok(new ApiDataResponse<>(
                true, "Delivery information updated.", user, null, HttpStatus.OK
        ));
    }
}
