package ra.edu.shoesphere.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
//import ra.edu.shoesphere.model.dto.request.ChangePasswordRequestDTO;
//import ra.edu.shoesphere.model.dto.request.ForgotPasswordRequestDTO;
import ra.edu.shoesphere.model.dto.request.UserRequestDTO;
import ra.edu.shoesphere.model.dto.response.UserResponseDTO;
import ra.edu.shoesphere.model.entity.User;
import ra.edu.shoesphere.repository.UserRepository;
import ra.edu.shoesphere.service.UserService;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponseDTO> getUsers(Integer page, Integer pageSize, String email) {
        String searchEmail = (email != null && !email.trim().isEmpty()) ? email.trim() : null;
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return userRepository.findAllUsersWithOptionalEmail(searchEmail,pageable).map(this::mapToResponseDTO);
    }

    @Override
    public Page<UserResponseDTO> filterUsersByStatus(Boolean status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (status == null) {
            return userRepository.findAll(pageable).map(this::mapToResponseDTO);
        }
        return userRepository.findByStatus(status, pageable).map(this::mapToResponseDTO);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUserStatus(Long userId, UserRequestDTO requestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng có ID: " + userId));

        user.setStatus(requestDTO.getStatus());
        User updatedUser = userRepository.save(user);
        return mapToResponseDTO(updatedUser);
    }

    private UserResponseDTO mapToResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .status(user.getStatus())
                .build();
    }

//    @Override
//    @Transactional
//    public void changePassword(String email, ChangePasswordRequestDTO requestDTO) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin tài khoản!"));
//
//        if (!passwordEncoder.matches(requestDTO.getOldPassword(), user.getPasswordHash())) {
//            throw new IllegalArgumentException("Mật khẩu cũ không chính xác!");
//        }
//
//        if (!requestDTO.getNewPassword().equals(requestDTO.getConfirmNewPassword())) {
//            throw new IllegalArgumentException("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
//        }
//
//        if (passwordEncoder.matches(requestDTO.getNewPassword(), user.getPasswordHash())) {
//            throw new IllegalArgumentException("Mật khẩu mới không được trùng với mật khẩu cũ!");
//        }
//
//        user.setPasswordHash(passwordEncoder.encode(requestDTO.getNewPassword()));
//        userRepository.save(user);
//    }
//
//    @Override
//    @Transactional
//    public String forgotPassword(ForgotPasswordRequestDTO requestDTO) {
//        User user = userRepository.findByEmail(requestDTO.getEmail().trim())
//                .orElseThrow(() -> new IllegalArgumentException("Email này không tồn tại trên hệ thống!"));
//
//        SecureRandom random = new SecureRandom();
//        int randomPin = 100000 + random.nextInt(900000);
//        String newPlainPassword = String.valueOf(randomPin);
//
//        user.setPasswordHash(passwordEncoder.encode(newPlainPassword));
//        userRepository.save(user);
//
//        return newPlainPassword;
//    }
}
