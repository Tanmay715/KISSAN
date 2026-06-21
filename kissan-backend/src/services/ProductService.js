const db = require('../config/database');
const { AppError } = require('../utils/errors');

class ProductService {
  async list({ category_slug, search, min_price, max_price, page = 1, limit = 12 }) {
    const offset = (page - 1) * limit;

    let query = db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .join('users', 'products.farmer_id', 'users.id')
      .where('products.is_active', true)
      .select(
        'products.*',
        'categories.name as category_name',
        'categories.slug as category_slug',
        'users.name as farmer_name',
      );

    if (category_slug) {
      query = query.where('categories.slug', category_slug);
    }

    if (search) {
      const search_term = `%${search}%`;
      query = query.where((builder) => {
        builder
          .where('products.name', 'like', search_term)
          .orWhere('products.description', 'like', search_term);
      });
    }

    if (min_price) {
      query = query.where('products.price_per_kg', '>=', min_price);
    }

    if (max_price) {
      query = query.where('products.price_per_kg', '<=', max_price);
    }

    const count_query = query.clone().clearSelect().count('products.id as total').first();
    const products = await query.orderBy('products.created_at', 'desc').limit(limit).offset(offset);
    const count_result = await count_query;
    const total = Number(count_result?.total || 0);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(product_id) {
    const product = await db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .join('users', 'products.farmer_id', 'users.id')
      .where('products.id', product_id)
      .select(
        'products.*',
        'categories.name as category_name',
        'categories.slug as category_slug',
        'users.name as farmer_name',
        'users.phone as farmer_phone',
      )
      .first();

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async create(farmer_id, data) {
    const [product_id] = await db('products').insert({
      farmer_id,
      category_id: data.category_id,
      name: data.name,
      description: data.description,
      price_per_kg: data.price_per_kg,
      quantity_kg: data.quantity_kg,
      unit: data.unit || 'kg',
      location: data.location,
      image_url: data.image_url,
    });

    return this.getById(product_id);
  }

  async update(product_id, farmer_id, data) {
    const product = await db('products').where({ id: product_id, farmer_id }).first();
    if (!product) {
      throw new AppError('Product not found or access denied', 404);
    }

    await db('products').where({ id: product_id }).update({
      category_id: data.category_id ?? product.category_id,
      name: data.name ?? product.name,
      description: data.description ?? product.description,
      price_per_kg: data.price_per_kg ?? product.price_per_kg,
      quantity_kg: data.quantity_kg ?? product.quantity_kg,
      unit: data.unit ?? product.unit,
      location: data.location ?? product.location,
      image_url: data.image_url ?? product.image_url,
      is_active: data.is_active ?? product.is_active,
    });

    return this.getById(product_id);
  }

  async delete(product_id, farmer_id) {
    const deleted = await db('products').where({ id: product_id, farmer_id }).del();
    if (!deleted) {
      throw new AppError('Product not found or access denied', 404);
    }

    return { message: 'Product deleted successfully' };
  }

  async listByFarmer(farmer_id) {
    return db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .where('products.farmer_id', farmer_id)
      .select('products.*', 'categories.name as category_name')
      .orderBy('products.created_at', 'desc');
  }
}

module.exports = ProductService;
