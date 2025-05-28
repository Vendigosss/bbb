import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  AlertTriangle, 
  Tag,
  Search,
  Ban,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Plus
} from 'lucide-react';
import { adminService } from '../services/admin';
import toast from 'react-hot-toast';

type TabType = 'users' | 'products' | 'reports' | 'categories';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const userData = await adminService.getUsers();
          setUsers(userData);
          break;
        case 'products':
          const productsData = await adminService.getProducts();
          setProducts(productsData);
          break;
        case 'reports':
          const reportsData = await adminService.getReports();
          setReports(reportsData);
          break;
        case 'categories':
          const categoriesData = await adminService.getCategories();
          setCategories(categoriesData);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Ошибка при загрузке данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    try {
      await adminService.updateUserStatus(userId, action);
      toast.success('Статус пользователя обновлен');
      loadData();
    } catch (error) {
      console.error('Error updating user status:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка при обновлении статуса';
      toast.error(errorMessage);
    }
  };

  const handleProductAction = async (productId: string, action: 'delete' | 'restore') => {
    try {
      const status = action === 'delete' ? 'deleted' : 'active';
      const response = await adminService.updateProductStatus(productId, status);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update product status');
      }
      
      toast.success('Статус товара обновлен');
      loadData();
    } catch (error) {
      console.error('Error updating product status:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка при обновлении статуса';
      toast.error(errorMessage);
    }
  };

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      await adminService.updateReportStatus(reportId, action);
      toast.success('Статус жалобы обновлен');
      loadData();
    } catch (error) {
      console.error('Error updating report status:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка при обновлении статуса';
      toast.error(errorMessage);
    }
  };

  const handleCategoryAction = async (categoryId: string | null, action: 'create' | 'update' | 'delete', data?: any) => {
    try {
      if (action === 'create') {
        await adminService.createCategory(data);
        toast.success('Категория создана');
      } else if (action === 'update') {
        await adminService.updateCategory(categoryId!, data);
        toast.success('Категория обновлена');
      } else if (action === 'delete') {
        await adminService.deleteCategory(categoryId!);
        toast.success('Категория удалена');
      }
      loadData();
    } catch (error) {
      console.error('Error managing category:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка при управлении категорией';
      toast.error(errorMessage);
    }
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'users':
        return users.filter(user => 
          (user.email?.toLowerCase() ?? '').includes(term) ||
          (user.name?.toLowerCase() ?? '').includes(term)
        );
      case 'products':
        return products.filter(product => 
          (product.title?.toLowerCase() ?? '').includes(term) ||
          (product.description?.toLowerCase() ?? '').includes(term)
        );
      case 'reports':
        return reports.filter(report => 
          (report.reason?.toLowerCase() ?? '').includes(term) ||
          (report.product?.title?.toLowerCase() ?? '').includes(term)
        );
      case 'categories':
        return categories.filter(category => 
          (category.name?.toLowerCase() ?? '').includes(term) ||
          (category.description?.toLowerCase() ?? '').includes(term)
        );
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Панель администратора</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium ${
            activeTab === 'users'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} className="mr-2" />
          Пользователи
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium ${
            activeTab === 'products'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag size={18} className="mr-2" />
          Товары
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium ${
            activeTab === 'reports'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertTriangle size={18} className="mr-2" />
          Жалобы
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center px-4 py-2 border-b-2 font-medium ${
            activeTab === 'categories'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Tag size={18} className="mr-2" />
          Категории
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData().map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'Без имени'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Активен' :
                           user.status === 'suspended' ? 'Заблокирован' : 'Забанен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {user.status === 'active' ? (
                            <>
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                               
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Забанить
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Активировать
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Товар
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Продавец
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData().map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.images[0]}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.price} ₽
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.seller.name || 'Без имени'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.seller.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'deleted'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status === 'active' ? 'Активен' :
                           product.status === 'deleted' ? 'Удален' : 'Продан'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {product.status === 'active' ? (
                            <button
                              onClick={() => handleProductAction(product.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Удалить
                            </button>
                          ) : (
                            <button
                              onClick={() => handleProductAction(product.id, 'restore')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Восстановить
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Товар
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Причина
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData().map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={report.product.images[0]}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {report.product.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {report.product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{report.reason}</div>
                        <div className="text-xs text-gray-500">
                          Отправлено: {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : report.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status === 'pending' ? 'На рассмотрении' :
                           report.status === 'resolved' ? 'Решено' : 'Отклонено'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReportAction(report.id, 'resolve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Решить
                            </button>
                            <button
                              onClick={() => handleReportAction(report.id, 'dismiss')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Отклонить
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-6">
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('Введите название категории:');
                    if (name) {
                      handleCategoryAction(null, 'create', {
                        name,
                        slug: name.toLowerCase().replace(/\s+/g, '-'),
                        description: prompt('Введите описание категории:') || ''
                      });
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <Plus size={18} className="mr-2" />
                  Добавить категорию
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData().map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const name = prompt('Введите новое название:', category.name);
                            if (name) {
                              handleCategoryAction(category.id, 'update', {
                                name,
                                description: prompt('Введите новое описание:', category.description) || category.description
                              });
                            }
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
                              handleCategoryAction(category.id, 'delete');
                            }
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Slug: {category.slug}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;