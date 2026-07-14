package ra.edu.shoesphere.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiDataResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Object error;
    private HttpStatus httpStatus;
}
