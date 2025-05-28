import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Package, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Package size={24} className="text-amber-300 mr-2" />
              <span className="text-xl font-bold text-white">МаркетХаб</span>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Надежная платформа для покупки и продажи товаров онлайн.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-300 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Маркетплейс</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-amber-300 transition-colors">Все товары</Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="text-gray-400 hover:text-amber-300 transition-colors">Электроника</Link>
              </li>
              <li>
                <Link to="/products?category=Clothing" className="text-gray-400 hover:text-amber-300 transition-colors">Одежда</Link>
              </li>
              <li>
                <Link to="/products?category=Home" className="text-gray-400 hover:text-amber-300 transition-colors">Дом и сад</Link>
              </li>
              <li>
                <Link to="/products?category=Sports" className="text-gray-400 hover:text-amber-300 transition-colors">Спорт</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-amber-300 transition-colors">Центр помощи</Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-400 hover:text-amber-300 transition-colors">Безопасность</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-amber-300 transition-colors">Условия использования</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-amber-300 transition-colors">Конфиденциальность</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-300 transition-colors">Связаться с нами</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-amber-300 mr-2 mt-1 flex-shrink-0" />
                <span>Будут контактные данные</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-amber-300 mr-2 flex-shrink-0" />
                <span>Будет номер</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-amber-300 mr-2 flex-shrink-0" />
                <span>support@markethub.ru</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {currentYear} МаркетХаб. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;