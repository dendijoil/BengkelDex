const {
  Order,
  Service,
  Workshop,
  sequelize,
  User
} = require("../models");

class OrderController {
  static async createOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { WorkshopId } = req.params;

      const [services] = req.body;

      const newOrder = await Order.create(
        {
          WorkshopId,
          totalPrice: 0,
          date: new Date(),
          paymentStatus: false,
          paymentType,
        },
        { transaction: t }
      );
        let totalPrice
      services.forEach(el => {
        const newOrderDetail = await OrderDetail.create({
            OrderId: newOrder.id,
            ServiceId: el.id,
            price: el.price,
        })
        totalPrice += newServices.price
      }, { transaction: t });

      const finalOrder = await Order.update({
        totalPrice,
      }, {
        where: {
            id: newOrder.id,
        },
        transaction: t 
      })

      await t.commit();

      res.status(201).json({
        message: "Success"
      });
    } catch (error) {
      t.rollback();
      res.status(500).json(error);
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: {
          UserId: User.id, // UserID dari model User yang login
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = OrderController;