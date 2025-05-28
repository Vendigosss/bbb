import React, { useState, useEffect } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/products';
import type { Product, Category } from '../types';

const ProductListingPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
  };

  const filteredProducts = products
    .filter(product => 
      selectedCategories.length === 0 || selectedCategories.includes(product.categorySlug)
    )
    .filter(product => {
      const price = Number(product.price);
      const min = Number(priceRange.min);
      const max = Number(priceRange.max);
      
      if (priceRange.min && price < min) return false;
      if (priceRange.max && price > max) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Все товары</h1>
        <div className="flex gap-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Сначала новые</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
          </select>
          <button
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Вид сеткой"
          >
            <Grid size={20} />
          </button>
          <button
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
            onClick={() => setViewMode('list')}
            title="Вид списком"
          >
            <List size={20} />
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
            Фильтры
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Фильтры</h2>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={clearFilters}
              >
                Очистить все
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Категории</h3>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.slug)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category.slug]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((slug) => slug !== category.slug)
                        );
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-medium mb-2">Диапазон цен</h3>
              <div className="flex gap-2">
                <div>
                  <label className="text-sm text-gray-600">От:</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">До:</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="999999"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Товары не найдены</h3>
              <p className="text-gray-600">
                Попробуйте изменить параметры поиска или фильтры
              </p>
              <button
                className="mt-4 text-teal-600 hover:text-teal-800"
                onClick={clearFilters}
              >
                Очистить все фильтры
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;