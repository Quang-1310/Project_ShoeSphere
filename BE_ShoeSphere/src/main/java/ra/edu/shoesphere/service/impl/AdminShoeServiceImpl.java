package ra.edu.shoesphere.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ra.edu.shoesphere.exception.ResourceNotFoundException;
import ra.edu.shoesphere.model.dto.request.ShoeRequestDTO;
import ra.edu.shoesphere.model.dto.response.ShoeResponseDTO;
import ra.edu.shoesphere.model.entity.Shoe;
import ra.edu.shoesphere.model.entity.ShoeSize;
import ra.edu.shoesphere.repository.ShoeRepository;
import ra.edu.shoesphere.service.AdminShoeService;
import ra.edu.shoesphere.service.CloudinaryService;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class AdminShoeServiceImpl implements AdminShoeService {

    @Autowired
    private ShoeRepository shoeRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public ShoeResponseDTO createShoe(ShoeRequestDTO request, MultipartFile image) throws IOException {
        String relativeImageUrl = null;
        if (image != null && !image.isEmpty()) {
            // 1. Lấy url tuyệt đối từ Cloudinary (vd: https://res.cloudinary.com/dq3ocm9yl/image/upload/v17112345/shoesphere/nike.png)
            String absoluteUrl = cloudinaryService.uploadFile(image);

            // 2. Chuyển đổi thành đường dẫn tương đối
            relativeImageUrl = convertToRelativePath(absoluteUrl);
        }

        Shoe shoe = Shoe.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .brand(request.getBrand())
                .imageUrl(relativeImageUrl) // Lưu "v17112345/shoesphere/nike.png" vào DB
                .status(request.getStatus())
                .isDeleted(false)
                .build();
                
        if (request.getSizes() != null) {
            List<ShoeSize> shoeSizes = request.getSizes().stream().map(dto -> ShoeSize.builder()
                    .shoe(shoe)
                    .size(dto.getSize())
                    .stockQuantity(dto.getStockQuantity())
                    .build()).collect(Collectors.toList());
            shoe.setSizes(shoeSizes);
        }

        Shoe savedShoe = shoeRepository.save(shoe);
        return mapToResponseDTO(savedShoe);
    }

    @Override
    @Transactional
    public ShoeResponseDTO updateShoe(Long id, ShoeRequestDTO request, MultipartFile image) throws IOException {
        Shoe shoe = shoeRepository.findShoeDetailJPQL(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại để cập nhật!"));

        shoe.setName(request.getName());
        shoe.setDescription(request.getDescription());
        shoe.setPrice(request.getPrice());
        shoe.setBrand(request.getBrand());
        shoe.setStatus(request.getStatus());

        if (request.getSizes() != null) {
            shoe.getSizes().clear();
            List<ShoeSize> newSizes = request.getSizes().stream().map(dto -> ShoeSize.builder()
                    .shoe(shoe)
                    .size(dto.getSize())
                    .stockQuantity(dto.getStockQuantity())
                    .build()).collect(Collectors.toList());
            shoe.getSizes().addAll(newSizes);
        }

        // Nếu cập nhật ảnh mới
        if (image != null && !image.isEmpty()) {
            String absoluteUrl = cloudinaryService.uploadFile(image);
            // Lưu đường dẫn tương đối mới
            shoe.setImageUrl(convertToRelativePath(absoluteUrl));
        }

        Shoe updatedShoe = shoeRepository.save(shoe);
        return mapToResponseDTO(updatedShoe);
    }

    // 💡 Hàm trợ giúp (Helper method) để cắt chuỗi lấy path tương đối
    private String convertToRelativePath(String absoluteUrl) {
        if (absoluteUrl == null) return null;

        String keyword = "/image/upload/";
        int index = absoluteUrl.indexOf(keyword);
        if (index != -1) {
            // Cắt bỏ toàn bộ phần domain phía trước, chỉ giữ lại phần sau "/image/upload/"
            return absoluteUrl.substring(index + keyword.length());
        }
        return absoluteUrl;
    }

    @Override
    @Transactional
    public void softDeleteShoe(Long id) {
        Shoe shoe = shoeRepository.findShoeDetailJPQL(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại hoặc đã được xóa trước đó!"));

        // Thực hiện xóa mềm (Soft Delete)
        shoe.setIsDeleted(true);
        shoe.setStatus(false); // Đóng trạng thái hiển thị bán
        shoeRepository.save(shoe);
    }

    // Helper map dữ liệu sang DTO
    private ShoeResponseDTO mapToResponseDTO(Shoe shoe) {
        return ShoeResponseDTO.builder()
                .id(shoe.getId())
                .name(shoe.getName())
                .description(shoe.getDescription())
                .price(shoe.getPrice())
                .brand(shoe.getBrand())
                .sizes(shoe.getSizes() != null ? shoe.getSizes().stream()
                        .map(s -> ra.edu.shoesphere.model.dto.ShoeSizeDTO.builder()
                                .size(s.getSize())
                                .stockQuantity(s.getStockQuantity())
                                .build())
                        .collect(Collectors.toList()) : new java.util.ArrayList<>())
                .imageUrl(shoe.getImageUrl())
                .status(shoe.getStatus())
                .build();
    }
}
