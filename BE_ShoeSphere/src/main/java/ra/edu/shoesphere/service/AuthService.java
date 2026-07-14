package ra.edu.shoesphere.service;


import ra.edu.shoesphere.model.dto.request.LoginRequestDTO;
import ra.edu.shoesphere.model.dto.request.RegisterRequestDTO;
import ra.edu.shoesphere.model.dto.request.TokenRefreshRequestDTO;
import ra.edu.shoesphere.model.dto.response.AuthResponse;

public interface AuthService {
    void register(RegisterRequestDTO request);

    AuthResponse login(LoginRequestDTO request);

    AuthResponse refreshToken(TokenRefreshRequestDTO request);

//    void logout(String accessTokenHeader);

}
