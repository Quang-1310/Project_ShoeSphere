package ra.edu.shoesphere.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ra.edu.shoesphere.exception.DataConflictException;
import ra.edu.shoesphere.model.dto.request.*;
import ra.edu.shoesphere.model.dto.response.AuthResponse;
import ra.edu.shoesphere.model.dto.response.JwtResponseDTO;
import ra.edu.shoesphere.model.entity.RefreshToken;
import ra.edu.shoesphere.model.entity.User;
import ra.edu.shoesphere.model.entity.enums.RoleEnum;
import ra.edu.shoesphere.repository.RefreshTokenRepository;
import ra.edu.shoesphere.repository.UserRepository;
import ra.edu.shoesphere.security.jwt.JwtProvider;
import ra.edu.shoesphere.security.principal.CustomUserDetails;
import ra.edu.shoesphere.service.AuthService;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;
//    private final StringRedisTemplate redisTemplate;

    @Override
    public void register(RegisterRequestDTO request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new DataConflictException("Email này đã được đăng ký trên hệ thống!");
        }

        RoleEnum assignedRole = RoleEnum.CUSTOMER;

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .status(true)
                .isDeleted(false)
                .build();

        userRepository.save(user);
    }

    @Override
    public AuthResponse login(LoginRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            String accessToken = jwtProvider.generateAccessToken(user);
            String refreshToken = jwtProvider.generateRefreshToken(user);

            RefreshToken newRefreshToken = new RefreshToken();
            newRefreshToken.setRefreshToken(refreshToken);
            newRefreshToken.setExpired(false);
            newRefreshToken.setRevoked(false);
            newRefreshToken.setUser(user);
            refreshTokenRepository.save(newRefreshToken);
            log.info("User login successfully");

            return new AuthResponse(accessToken, refreshToken);

        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Sai thông tin tài khoản hoặc mật khẩu đăng nhập!");
        } catch (DisabledException | LockedException ex) {
            throw new IllegalStateException("Tài khoản của bạn đã bị khóa hoặc tạm ngưng hoạt động!");
        }
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequestDTO request) {
        String refreshTokenStr = request.getRefreshToken();

        if (refreshTokenStr != null && jwtProvider.validateToken(refreshTokenStr)) {

            boolean isSessionValid = refreshTokenRepository.existsByRefreshTokenAndRevokedFalseAndExpiredFalse(refreshTokenStr);

            if (!isSessionValid) {
                throw new IllegalArgumentException("Phiên làm việc này đã bị vô hiệu hóa hoặc hết hạn!");
            }

            String email = jwtProvider.extractUsername(refreshTokenStr);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại!"));

            if (!user.getStatus()) {
                throw new IllegalStateException("Tài khoản đang bị khóa, không thể làm mới phiên truy cập!");
            }

            String newAccessToken = jwtProvider.generateAccessToken(user);

            return new AuthResponse(newAccessToken, refreshTokenStr);
        }

        throw new IllegalArgumentException("Mã Refresh Token không hợp lệ hoặc đã hết hạn!");
    }


//    @Override
//    @Transactional
//    public void logout(String accessTokenHeader) {
//
//        if (accessTokenHeader == null || !accessTokenHeader.startsWith("Bearer ")) {
//            throw new IllegalArgumentException("Yêu cầu định dạng mã xác thực Bearer Token không hợp lệ!");
//        }
//
//        String token = accessTokenHeader.substring(7);
//
//        if (!jwtProvider.validateToken(token)) {
//            throw new BadCredentialsException("Mã xác thực Access Token không hợp lệ hoặc đã hết hạn!");
//        }
//
//        String email = jwtProvider.extractUsername(token);
//        User user = userRepository.findByEmail(email).orElse(null);
//
//        if (user != null) {
//            refreshTokenRepository.findByUser(user)
//                    .forEach(refreshToken -> {
//                        refreshToken.setRevoked(true);
//                        refreshToken.setExpired(true);
//                    });
//
//            long expirationRemainingInMillis = jwtProvider.getExpirationRemaining(token);
//
////            if (expirationRemainingInMillis <= 0) {
////                expirationRemainingInMillis = 900000;
////            }
//
//            String redisKey = "blacklist:" + token;
//
//            redisTemplate.opsForValue().set(
//                    redisKey,
//                    "revoked",
//                    expirationRemainingInMillis,
//                    TimeUnit.MILLISECONDS
//            );
//
//            log.info("User logged out successfully. Token added to Redis Blacklist with TTL: {} ms", expirationRemainingInMillis);
//        }
//    }


}

