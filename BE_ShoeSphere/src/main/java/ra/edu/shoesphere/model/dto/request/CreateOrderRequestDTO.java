package ra.edu.shoesphere.model.dto.request;
import jakarta.validation.constraints.NotEmpty; import lombok.Data; import java.util.List;
@Data public class CreateOrderRequestDTO { @NotEmpty private List<Long> cartItemIds; }
