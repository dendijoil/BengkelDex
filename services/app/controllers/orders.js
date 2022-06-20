const { Order, OrderDetail, sequelize } = require("../models");

class OrderController {
  static async createOrder(req, res) {
    // const t = await sequelize.transaction();
    try {
      const { WorkshopId } = req.params;

      const { services, username } = req.body;
      services.map((el) => {
        el = JSON.stringify(el);
        el = JSON.parse(el);
        return el
      })
      // const stringfied = JSON.stringify(services[0])
      console.log(services)
      // console.log(services[0], username);

      // const newOrder = await Order.create(
      //   {
      //     UserId: username,
      //     WorkshopId,
      //     totalPrice: 0,
      //     date: new Date(),
      //     paymentStatus: false,
      //     paymentType,
      //   },
      //   { transaction: t }
      // );
      // let totalPrice;
      // services.forEach(
      //   async (el) => {
      //     const newOrderDetail = await OrderDetail.create({
      //       OrderId: newOrder.id,
      //       ServiceId: el.id,
      //       price: el.price,
      //     });
      //     totalPrice += newServices.price;
      //   },
      //   { transaction: t }
      // );

      // const finalOrder = await Order.update(
      //   {
      //     totalPrice,
      //   },
      //   {
      //     where: {
      //       id: newOrder.id,
      //     },
      //     transaction: t,
      //   }
      // );

      // await t.commit();

      res.status(201).json({
        message: "Success",
      });
    } catch (error) {
      // t.rollback();
      console.log(error)
      res.status(500).json(error);
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: {
          UserId: req.user.id, // UserID dari model User yang login
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getAllOrderDetails(req, res) {
    try {
      const order = await Order.findOne({
        where: {
          id: req.params.OrderId,
        },
      });
      const orderDetails = await OrderDetail.findAll({
        where: {
          OrderId: Order.id,
        },
      });
      res.status(200).json(orderDetails);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = OrderController;
