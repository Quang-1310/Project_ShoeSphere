package ra.edu.shoesphere.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//import ra.edu.shoesphere.model.dto.request.ForgotPasswordRequestDTO;
import ra.edu.shoesphere.model.dto.request.LoginRequestDTO;
import ra.edu.shoesphere.model.dto.request.RegisterRequestDTO;
import ra.edu.shoesphere.model.dto.request.TokenRefreshRequestDTO;
import ra.edu.shoesphere.model.dto.response.ApiDataResponse;
import ra.edu.shoesphere.model.dto.response.AuthResponse;
import ra.edu.shoesphere.model.dto.response.UserResponseDTO;
import ra.edu.shoesphere.service.AuthService;
import ra.edu.shoesphere.service.UserService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiDataResponse<Void>> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);

        ApiDataResponse<Void> response = new ApiDataResponse<>(
                true,
                "Đăng ký tài khoản thành công!",
                null,
                null,
                HttpStatus.CREATED
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiDataResponse<AuthResponse>> login(@Valid @RequestBody LoginRequestDTO request) {
        AuthResponse authResponse = authService.login(request);

        ApiDataResponse<AuthResponse> response = new ApiDataResponse<>(
                true,
                "Đăng nhập hệ thống thành công!",
                authResponse,
                null,
                HttpStatus.OK
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiDataResponse<AuthResponse>> refresh(@Valid @RequestBody TokenRefreshRequestDTO request) {
        AuthResponse authResponse = authService.refreshToken(request);

        ApiDataResponse<AuthResponse> response = new ApiDataResponse<>(
                true,
                "Cấp mới Access Token thành công!",
                authResponse,
                null,
                HttpStatus.OK
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiDataResponse<UserResponseDTO>> getMyProfile() {
        UserResponseDTO userProfile = authService.getProfileMe();

        ApiDataResponse<UserResponseDTO> response = new ApiDataResponse<>(
                true,
                "Lấy thông tin tài khoản thành công!",
                userProfile,
                null,
                HttpStatus.OK
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiDataResponse<Void>> logout(
            @RequestHeader("Authorization") String tokenHeader,
            @Valid @RequestBody TokenRefreshRequestDTO request
    ) {
        authService.logout(tokenHeader, request);
        return ResponseEntity.ok(new ApiDataResponse<>(
                true,
                "Logout successful",
                null,
                null,
                HttpStatus.OK
        ));
    }

//    @PostMapping("/logout")
//    public ResponseEntity<ApiDataResponse<Void>> logout(@RequestHeader("Authorization") String tokenHeader) {
//        authService.logout(tokenHeader);
//
//        ApiDataResponse<Void> response = new ApiDataResponse<>(
//                true,
//                "Đăng xuất và thu hồi phiên làm việc thành công!",
//                null,
//                null,
//                HttpStatus.OK
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/forgot-password")
//    public ResponseEntity<ApiDataResponse<String>> forgotPassword(
//            @RequestBody ForgotPasswordRequestDTO requestDTO
//    ) {
//        String temporaryPassword = userService.forgotPassword(requestDTO);
//
//        return new ResponseEntity<>(new ApiDataResponse<>(
//                true,
//                "Cấp lại mật khẩu thành công! Mật khẩu mới của bạn là: " + temporaryPassword,
//                temporaryPassword,
//                null,
//                HttpStatus.OK
//        ), HttpStatus.OK);
//    }
}
