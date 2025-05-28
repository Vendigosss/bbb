import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, ShoppingBag, CreditCard, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orders';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [shippingOption, setShippingOption] = useState<string>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const shippingCost = shippingOption === 'express' ? 1000 : 400;
  const orderTotal = total + shippingCost;
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ваша корзина пуста</h1>
          <p className="text-gray-600 mb-8">
            Похоже, вы не добавили ничего в корзину
          </p>
          <Link 
            to="/products" 
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-flex items-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };
  
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Create orders for each item
      const orderPromises = items.map(item => 
        orderService.createOrder(
          item.product.id,
          item.product.price * item.quantity
        )
      );

      const results = await Promise.all(orderPromises);
      
      // Check if all orders were created successfully
      if (results.every(result => result !== null)) {
        toast.success('Заказы успешно оформлены');
        clearCart();
        navigate('/orders');
      } else {
        throw new Error('Failed to create some orders');
      }
    } catch (error) {
      console.error('Error creating orders:', error);
      toast.error('Ошибка при оформлении заказов');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="text-teal-600 hover:text-teal-800 flex items-center">
          <ChevronLeft size={18} /> К товарам
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Корзина</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 border-b text-sm font-medium text-gray-500">
              <div className="col-span-2">Товар</div>
              <div className="text-center">Цена</div>
              <div className="text-center">Количество</div>
              <div className="text-right">Итого</div>
            </div>
            
            {items.map(item => (
              <div key={item.product.id} className="border-b last:border-0 p-4">
                <div className="md:grid md:grid-cols-5 md:items-center flex flex-col">
                  {/* Product */}
                  <div className="col-span-2 flex">
                    <Link to={`/product/${item.product.id}`} className="w-20 h-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link to={`/product/${item.product.id}`} className="font-medium text-gray-800 hover:text-teal-600 line-clamp-2">
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center mt-2 md:hidden"
                      >
                        <Trash2 size={14} className="mr-1" /> Удалить
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center md:mt-0 mt-4">
                    <span className="md:hidden inline-block w-24 text-sm text-gray-500">Цена: </span>
                    <span className="font-medium">₽{item.product.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity */}
                  <div className="text-center md:mt-0 mt-4">
                    <div className="flex items-center justify-center md:justify-center">
                      <span className="md:hidden inline-block w-24 text-sm text-gray-500">Количество: </span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="text-right md:mt-0 mt-4 flex justify-between md:block">
                    <span className="md:hidden inline-block text-sm text-gray-500">Итого: </span>
                    <div className="flex items-center justify-end">
                      <span className="font-medium">₽{(item.product.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 ml-4 hidden md:block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 border-t">
              <button 
                onClick={() => clearCart()}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Сумма</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Кол-во ({items.reduce((acc, item) => acc + item.quantity, 0)} товаров)</span>
                <span className="font-medium">₽{total.toFixed(2)}</span>
              </div>
              
              {!isCheckingOut ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span className="font-medium">--</span>
                  </div>
                  <div className="flex justify-between">
                    
                    
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between">
                    <span className="font-semibold">К оплате</span>
                    <span className="font-bold">₽{total.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Варианты доставки</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shippingOption === 'standard'}
                          onChange={() => setShippingOption('standard')}
                          className="text-teal-600 focus:ring-teal-500 h-4 w-4"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Стандартная доставка</p>
                          <p className="text-xs text-gray-500">5-7 дней</p>
                        </div>
                        <span className="ml-auto font-medium">₽400</span>
                      </label>
                      <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shippingOption === 'express'}
                          onChange={() => setShippingOption('express')}
                          className="text-teal-600 focus:ring-teal-500 h-4 w-4"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Экспресс доставка</p>
                          <p className="text-xs text-gray-500">2-3 дня</p>
                        </div>
                        <span className="ml-auto font-medium">₽1000</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Способ оплаты</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="text-teal-600 focus:ring-teal-500 h-4 w-4"
                        />
                        <div className="ml-3 flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Банковская карта</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="text-teal-600 focus:ring-teal-500 h-4 w-4"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">СБП</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-4"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товары</span>
                    <span className="font-medium">₽{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span className="font-medium">₽{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                  
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Итого</span>
                    <span className="font-bold">₽{orderTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
            
            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Оформить заказ
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Оформление заказа...
                  </div>
                ) : (
                  'Подтвердить заказ'
                )}
              </button>
            )}
            
            {isCheckingOut && (
              <button
                onClick={() => setIsCheckingOut(false)}
                className="w-full text-teal-600 hover:text-teal-800 text-sm font-medium py-2 mt-2"
              >
               Назад
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;