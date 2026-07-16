package ra.edu.shoesphere.service.impl;
import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import ra.edu.shoesphere.model.dto.request.CartItemRequestDTO; import ra.edu.shoesphere.model.dto.response.CartItemResponseDTO; import ra.edu.shoesphere.model.entity.*; import ra.edu.shoesphere.repository.*; import ra.edu.shoesphere.service.CartService; import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional 
public class CartServiceImpl implements CartService { 
    private final UserRepository users; 
    private final ShoeRepository shoes; 
    private final CartItemRepository items; 

    private User u(String e){
        return users.findByEmail(e).orElseThrow(()->new IllegalArgumentException("User not found."));
    } 

    private CartItemResponseDTO m(CartItem i){
        Shoe s=i.getShoe();
        Integer sizeQuantity = 0;
        if (s.getSizes() != null) {
            sizeQuantity = s.getSizes().stream()
                .filter(sz -> sz.getSize().equals(i.getSize()))
                .map(ShoeSize::getStockQuantity)
                .findFirst().orElse(0);
        }
        return CartItemResponseDTO.builder()
            .id(i.getId())
            .shoeId(s.getId())
            .name(s.getName())
            .imageUrl(s.getImageUrl())
            .price(s.getPrice())
            .size(i.getSize())
            .quantity(i.getQuantity())
            .stockQuantity(sizeQuantity)
            .build();
    } 

    public List<CartItemResponseDTO> get(String e){
        return items.findByUserOrderByIdDesc(u(e)).stream().map(this::m).toList();
    } 

    public CartItemResponseDTO add(String e,CartItemRequestDTO r){
        User u=u(e);
        Shoe s=shoes.findShoeDetailJPQL(r.getShoeId()).orElseThrow(()->new IllegalArgumentException("Shoe not found."));
        
        Integer stockForSize = 0;
        if (s.getSizes() != null) {
            stockForSize = s.getSizes().stream()
                .filter(sz -> sz.getSize().equals(r.getSize()))
                .map(ShoeSize::getStockQuantity)
                .findFirst().orElse(0);
        }
        
        CartItem i=items.findByUserAndShoeAndSize(u,s,r.getSize()).orElseGet(()->{
            CartItem x=new CartItem();
            x.setUser(u);
            x.setShoe(s);
            x.setSize(r.getSize());
            x.setQuantity(0);
            return x;
        });
        
        if (i.getQuantity() + r.getQuantity() > stockForSize) {
            throw new IllegalArgumentException("Không đủ hàng trong kho cho size này.");
        }
        
        i.setQuantity(i.getQuantity()+r.getQuantity());
        return m(items.save(i));
    } 

    public CartItemResponseDTO update(String e,Long id,Integer q){
        CartItem i=items.findByIdAndUser(id,u(e)).orElseThrow(()->new IllegalArgumentException("Cart item not found."));
        i.setQuantity(q);
        return m(items.save(i));
    } 

    public void delete(String e,Long id){
        items.delete(items.findByIdAndUser(id,u(e)).orElseThrow(()->new IllegalArgumentException("Cart item not found.")));
    } 
}
