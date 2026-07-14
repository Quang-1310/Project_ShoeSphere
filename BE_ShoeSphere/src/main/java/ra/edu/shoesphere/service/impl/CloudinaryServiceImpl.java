package ra.edu.shoesphere.service.impl;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ra.edu.shoesphere.service.CloudinaryService;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("File tải lên không hợp lệ hoặc rỗng");
        }

        // Upload file lên Cloudinary trong thư mục 'shoesphere'
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                multipartFile.getBytes(),
                ObjectUtils.asMap("folder", "shoesphere")
        );

        return uploadResult.get("secure_url").toString();
    }
}
