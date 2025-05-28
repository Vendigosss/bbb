/*
  # Update categories to Russian language
  
  1. Changes
    - Update existing categories to Russian names
    - Preserve foreign key relationships
    - Update descriptions to Russian
*/

-- Update existing categories to Russian names
UPDATE categories SET
  name = 'Электроника',
  slug = 'elektronika',
  description = 'Гаджеты, компьютеры, смартфоны и другие электронные устройства'
WHERE slug = 'electronics';

UPDATE categories SET
  name = 'Одежда',
  slug = 'odezhda',
  description = 'Одежда, обувь, аксессуары и украшения'
WHERE slug = 'fashion';

UPDATE categories SET
  name = 'Дом и сад',
  slug = 'dom-i-sad',
  description = 'Мебель, декор, садовые инструменты и товары для дома'
WHERE slug = 'home-garden';

UPDATE categories SET
  name = 'Спорт и отдых',
  slug = 'sport-i-otdyh',
  description = 'Спортивное снаряжение, товары для активного отдыха и фитнеса'
WHERE slug = 'sports-outdoors';

UPDATE categories SET
  name = 'Книги и медиа',
  slug = 'knigi-i-media',
  description = 'Книги, фильмы, музыка и учебные материалы'
WHERE slug = 'books-media';

UPDATE categories SET
  name = 'Коллекционирование',
  slug = 'kollektsionirovanie',
  description = 'Редкие предметы, антиквариат, искусство и памятные вещи'
WHERE slug = 'collectibles';

UPDATE categories SET
  name = 'Автотовары',
  slug = 'avtotovary',
  description = 'Автомобили, запчасти, инструменты и аксессуары'
WHERE slug = 'automotive';

UPDATE categories SET
  name = 'Игрушки и игры',
  slug = 'igrushki-i-igry',
  description = 'Настольные игры, игрушки, видеоигры и развлечения'
WHERE slug = 'toys-games';

UPDATE categories SET
  name = 'Красота и здоровье',
  slug = 'krasota-i-zdorovie',
  description = 'Уход за собой, косметика и товары для здоровья'
WHERE slug = 'health-beauty';

UPDATE categories SET
  name = 'Товары для животных',
  slug = 'tovary-dlya-zhivotnyh',
  description = 'Корма, аксессуары и товары для ухода за питомцами'
WHERE slug = 'pet-supplies';

UPDATE categories SET
  name = 'Другое',
  slug = 'drugoe',
  description = 'Разные товары, не подходящие под другие категории'
WHERE slug = 'other';