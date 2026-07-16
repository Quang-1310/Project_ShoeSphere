import configAPI from './configAPI';
export interface CartItem { id:number; shoeId:number; name:string; imageUrl:string; price:number; size:number; quantity:number; stockQuantity:number; }
export const getCart=async()=>((await configAPI.get('/cart')).data.data as CartItem[]);
export const addCartItem=async(shoeId:number,size:number)=>((await configAPI.post('/cart/items',{shoeId,size,quantity:1})).data.data as CartItem);
export const updateCartItem=(id:number,shoeId:number,size:number,quantity:number)=>configAPI.put(`/cart/items/${id}`,{shoeId,size,quantity});
export const removeCartItem=(id:number)=>configAPI.delete(`/cart/items/${id}`);
