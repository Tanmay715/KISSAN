const bcrypt = require('bcryptjs');

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  await knex('order_items').del();
  await knex('orders').del();
  await knex('products').del();
  await knex('categories').del();
  await knex('users').del();

  const password_hash = await bcrypt.hash('password123', 10);

  await knex('users').insert([
    {
      name: 'Ramesh Kumar',
      email: 'farmer@kissan.com',
      password_hash,
      role: 'farmer',
      phone: '9876543210',
      address: 'Village Rampur, Meerut, UP',
    },
    {
      name: 'Priya Sharma',
      email: 'buyer@kissan.com',
      password_hash,
      role: 'buyer',
      phone: '9123456780',
      address: 'Sector 18, Noida, UP',
    },
  ]);

  const farmer = await knex('users').where({ email: 'farmer@kissan.com' }).first();
  const farmer_id = farmer.id;

  const categories = [
    { name: 'Wheat', slug: 'wheat', icon: '🌾' },
    { name: 'Pulses', slug: 'pulses', icon: '🫘' },
    { name: 'Rice', slug: 'rice', icon: '🍚' },
    { name: 'Vegetables', slug: 'vegetables', icon: '🥬' },
    { name: 'Fruits', slug: 'fruits', icon: '🍎' },
    { name: 'Spices', slug: 'spices', icon: '🌶️' },
  ];

  await knex('categories').insert(categories);
  const category_rows = await knex('categories').select('id', 'slug');
  const category_map = Object.fromEntries(category_rows.map((row) => [row.slug, row.id]));

  await knex('products').insert([
    {
      farmer_id,
      category_id: category_map.wheat,
      name: 'Sharbati Wheat',
      description: 'Premium quality Sharbati wheat, freshly harvested from organic farms.',
      price_per_kg: 28.5,
      quantity_kg: 500,
      location: 'Meerut, UP',
      image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    },
    {
      farmer_id,
      category_id: category_map.pulses,
      name: 'Moong Dal (Green Gram)',
      description: 'Clean, sorted moong dal with high protein content.',
      price_per_kg: 95,
      quantity_kg: 200,
      location: 'Meerut, UP',
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    },
    {
      farmer_id,
      category_id: category_map.pulses,
      name: 'Chana Dal (Bengal Gram)',
      description: 'Farm-fresh chana dal, ideal for daily cooking.',
      price_per_kg: 72,
      quantity_kg: 300,
      location: 'Meerut, UP',
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    },
    {
      farmer_id,
      category_id: category_map.rice,
      name: 'Basmati Rice',
      description: 'Long-grain aromatic basmati rice from Punjab belt.',
      price_per_kg: 85,
      quantity_kg: 400,
      location: 'Meerut, UP',
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    },
    {
      farmer_id,
      category_id: category_map.vegetables,
      name: 'Fresh Tomatoes',
      description: 'Vine-ripened tomatoes, pesticide-free.',
      price_per_kg: 35,
      quantity_kg: 150,
      location: 'Meerut, UP',
      image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    },
    {
      farmer_id,
      category_id: category_map.spices,
      name: 'Turmeric Powder',
      description: 'Pure haldi powder from freshly dried roots.',
      price_per_kg: 180,
      quantity_kg: 50,
      location: 'Meerut, UP',
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    },
  ]);

  console.log('Seed complete. Demo accounts:');
  console.log('  Farmer: farmer@kissan.com / password123');
  console.log('  Buyer:  buyer@kissan.com / password123');
};
