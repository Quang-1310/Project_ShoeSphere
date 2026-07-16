import configAPI from './configAPI';
export interface CartItem { id:number; shoeId:number; name:string; imageUrl:string; price:number; quantity:number; stockQuantity:number; }
export const getCart=async()=>((await configAPI.get('/cart')).data.data as CartItem[]);
export const addCartItem=(shoeId:number)=>configAPI.post('/cart/items',{shoeId,quantity:1});
export const updateCartItem=(id:number,shoeId:number,quantity:number)=>configAPI.put(`/cart/items/${id}`,{shoeId,quantity});
export const removeCartItem=(id:number)=>configAPI.delete(`/cart/items/${id}`);
