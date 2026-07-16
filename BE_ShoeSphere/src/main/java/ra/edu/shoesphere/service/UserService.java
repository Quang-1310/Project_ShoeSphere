package ra.edu.shoesphere.service;

import org.springframework.data.domain.Page;
//import ra.edu.shoesphere.model.dto.request.ChangePasswordRequestDTO;
//import ra.edu.shoesphere.model.dto.request.ForgotPasswordRequestDTO;
import ra.edu.shoesphere.model.dto.request.UserRequestDTO;
import ra.edu.shoesphere.model.dto.request.DeliveryInfoRequestDTO;
import ra.edu.shoesphere.model.dto.response.UserResponseDTO;

public interface UserService {
    Page<UserResponseDTO> getUsers(Integer page, Integer pageSize, String email);

    Page<UserResponseDTO> filterUsersByStatus(Boolean isActive, int page, int size);

    UserResponseDTO updateUserStatus(Long userId, UserRequestDTO requestDTO);

    Page<UserResponseDTO> getCustomers(Integer page, Integer pageSize, String email);

    UserResponseDTO toggleCustomerStatus(Long userId);

    void softDeleteCustomer(Long userId);

    UserResponseDTO updateMyDeliveryInfo(String email, DeliveryInfoRequestDTO request);

//    void changePassword(String email, ChangePasswordRequestDTO requestDTO);
//
//    String forgotPassword(ForgotPasswordRequestDTO requestDTO);
}
