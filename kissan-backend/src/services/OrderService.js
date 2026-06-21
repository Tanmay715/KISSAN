const db = require('../config/database');
const { AppError } = require('../utils/errors');

class OrderService {
  async create(buyer_id, { items, shipping_address }) {
    if (!items?.length) {
      throw new AppError('Order must contain at least one item', 400);
    }

    return db.transaction(async (trx) => {
      let total_amount = 0;
      const order_items = [];

      for (const item of items) {
        const product = await trx('products')
          .where({ id: item.product_id, is_active: true })
          .forUpdate()
          .first();

        if (!product) {
          throw new AppError(`Product ${item.product_id} not found`, 404);
        }

        if (Number(product.quantity_kg) < Number(item.quantity_kg)) {
          throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }

        const subtotal = Number(item.quantity_kg) * Number(product.price_per_kg);
        total_amount += subtotal;

        order_items.push({
          product_id: product.id,
          farmer_id: product.farmer_id,
          quantity_kg: item.quantity_kg,
          price_per_kg: product.price_per_kg,
          subtotal,
        });

        await trx('products')
          .where({ id: product.id })
          .decrement('quantity_kg', item.quantity_kg);
      }

      const [order_id] = await trx('orders').insert({
        buyer_id,
        total_amount,
        shipping_address,
        status: 'pending',
      });

      await trx('order_items').insert(
        order_items.map((item) => ({ ...item, order_id })),
      );

      return this.getById(order_id, trx);
    });
  }

  async getById(order_id, trx = db) {
    const order = await trx('orders')
      .join('users', 'orders.buyer_id', 'users.id')
      .where('orders.id', order_id)
      .select('orders.*', 'users.name as buyer_name', 'users.email as buyer_email')
      .first();

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.items = await trx('order_items')
      .join('products', 'order_items.product_id', 'products.id')
      .where('order_items.order_id', order_id)
      .select(
        'order_items.*',
        'products.name as product_name',
        'products.image_url',
      );

    return order;
  }

  async listByBuyer(buyer_id) {
    const orders = await db('orders')
      .where({ buyer_id })
      .orderBy('created_at', 'desc');

    return Promise.all(orders.map((order) => this.getById(order.id)));
  }

  async listByFarmer(farmer_id) {
    const order_ids = await db('order_items')
      .where({ farmer_id })
      .distinct('order_id')
      .pluck('order_id');

    if (!order_ids.length) {
      return [];
    }

    const orders = await db('orders')
      .whereIn('id', order_ids)
      .orderBy('created_at', 'desc');

    const results = await Promise.all(orders.map((order) => this.getById(order.id)));

    return results.map((order) => ({
      ...order,
      items: order.items.filter((item) => item.farmer_id === farmer_id),
    }));
  }

  async updateStatus(order_id, status, user) {
    const order = await db('orders').where({ id: order_id }).first();
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const valid_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid_statuses.includes(status)) {
      throw new AppError('Invalid order status', 400);
    }

    if (user.role === 'buyer' && order.buyer_id !== user.id) {
      throw new AppError('Access denied', 403);
    }

    await db('orders').where({ id: order_id }).update({ status });
    return this.getById(order_id);
  }
}

module.exports = OrderService;
