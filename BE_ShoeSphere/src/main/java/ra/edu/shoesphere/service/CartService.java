package ra.edu.shoesphere.service;
import java.util.*;
import ra.edu.shoesphere.model.dto.request.CartItemRequestDTO;
import ra.edu.shoesphere.model.dto.response.CartItemResponseDTO;
public interface CartService {
    List<CartItemResponseDTO> get(String email);
    CartItemResponseDTO add(String email,CartItemRequestDTO r);
    CartItemResponseDTO update(String email,Long id,Integer quantity);
    void delete(String email,Long id);
}
