package ra.edu.shoesphere.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import ra.edu.shoesphere.model.dto.request.ShoeRequestDTO;
import ra.edu.shoesphere.model.dto.response.PageResponseDTO;
import ra.edu.shoesphere.model.dto.response.ShoeResponseDTO;

import java.io.IOException;
import java.math.BigDecimal;

public interface AdminShoeService {

    ShoeResponseDTO createShoe(ShoeRequestDTO request, MultipartFile image) throws IOException;

    ShoeResponseDTO updateShoe(Long id, ShoeRequestDTO request, MultipartFile image) throws IOException;

    void softDeleteShoe(Long id);
}
