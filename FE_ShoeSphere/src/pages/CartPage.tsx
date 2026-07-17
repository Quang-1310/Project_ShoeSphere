import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Header } from '../components/Header';
import { getCart, removeCartItem, updateCartItem, type CartItem } from '../api/cartAPI';
import { createOrder } from '../api/orderAPI';

export const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const nav = useNavigate();

  // Load danh sách giỏ hàng
  const load = () => {
    getCart()
      .then(setItems)
      .catch(() => nav('/login'));
  };

  useEffect(() => {
    load();
  }, []);

  // Tính tổng tiền dựa trên các sản phẩm được chọn
  const total = useMemo(() => {
    return items
      .filter((x) => selected.includes(x.id))
      .reduce((s, x) => s + x.price * x.quantity, 0);
  }, [items, selected]);

  const qty = async (x: CartItem, q: number) => {
    if (q < 1) return;
    await updateCartItem(x.id, x.shoeId, x.size, q);
    load();
  };

  // Xử lý chọn/bỏ chọn item bằng checkbox
  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemove = async (id: number) => {
    const result = await Swal.fire({
      title: 'Xóa sản phẩm?',
      text: 'Bạn có chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444'
    });
    
    if (result.isConfirmed) {
      await removeCartItem(id);
      window.dispatchEvent(new Event('cartUpdated'));
      load();
    }
  };

  // Xử lý khi nhấn nút Đặt hàng
  const handleCheckout = async () => {
    if (!selected.length) return void Swal.fire('Hãy chọn sản phẩm');
    try { 
      await createOrder(selected); 
      await Swal.fire({ icon: 'success', title: 'Đặt hàng thành công', timer: 1800, showConfirmButton: false }); 
      nav('/my-orders'); 
    }
    catch (error) { 
      const msg = error.response?.data?.message || String(error);
      if (msg.includes("Delivery information is required") || msg.includes("địa chỉ")) {
        Swal.fire({ 
          icon: 'warning', 
          title: 'Thiếu địa chỉ', 
          text: 'Vui lòng cập nhật thông tin giao hàng trong hồ sơ của bạn.' 
        }).then(() => {
          nav('/profile');
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Không thể đặt hàng', text: msg }); 
      }
    }
  };

  return (
    <><Header onAuthWarning={(action) => Swal.fire({ icon: 'warning', title: 'Cần đăng nhập', text: `Bạn cần đăng nhập để ${action}.` })} /><div style={{ maxWidth: 1000, margin: '32px auto', fontFamily: 'sans-serif' }}>
      <h2>Giỏ hàng</h2>

      {/* Danh sách sản phẩm */}
      {items.map((x) => (
        <div
          key={x.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 16,
            borderBottom: '1px solid #ddd',
          }}
        >
          <input
            type="checkbox"
            checked={selected.includes(x.id)}
            onChange={() => handleSelect(x.id)}
          />

          <img
            src={
              x.imageUrl
                ? x.imageUrl.startsWith('http')
                  ? x.imageUrl
                  : `https://res.cloudinary.com/dq3ocm9yl/image/upload/${x.imageUrl}`
                : 'https://placehold.co/140x140?text=No+Image'
            }
            alt={x.name}
            onError={(event) => { event.currentTarget.src = 'https://placehold.co/140x140?text=No+Image'; }}
            style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8, background: '#f3f4f6' }}
          />

          <div style={{ flex: 1 }}>
            <b>{x.name}</b>
            <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>Size: {x.size}</p>
            <p>{x.price.toLocaleString('vi-VN')} đ</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 8, overflow: 'hidden' }}><button onClick={() => qty(x, x.quantity - 1)} style={{ width: 34, height: 34, border: 0, background: '#f8fafc', cursor: 'pointer', fontSize: 18 }}>-</button><span style={{ width: 36, textAlign: 'center', fontWeight: 600 }}>{x.quantity}</span><button onClick={() => qty(x, x.quantity + 1)} style={{ width: 34, height: 34, border: 0, background: '#f8fafc', cursor: 'pointer', fontSize: 18 }}>+</button></div>

          <button onClick={() => handleRemove(x.id)} style={{ padding: '9px 13px', color: '#dc2626', border: '1px solid #fecaca', background: '#fff1f2', borderRadius: 7, cursor: 'pointer' }}>Xóa</button>
        </div>
      ))}

      {/* Tổng tiền & Đặt hàng */}
      <h3>Tổng tiền: {total.toLocaleString('vi-VN')} đ</h3>
      
      <button
        onClick={handleCheckout}
        style={{
          padding: '12px 24px',
          background: '#2563eb',
          color: '#fff',
          border: 0,
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Đặt hàng
      </button>
    </div></>
  );
};
