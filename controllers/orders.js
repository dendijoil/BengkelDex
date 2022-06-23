const { Order, OrderDetail, sequelize, Service, User, Workshop } = require("../models");
const { Op } = require("sequelize");

class OrderController {
  static async createOrder(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { WorkshopId } = req.params;

      const { services, username, paymentType } = req.body;

      const user = await User.findOne(
        {
          where: {
            username,
          },
        },
        { transaction: t }
      );

      const newOrder = await Order.create(
        {
          UserId: user.id,
          WorkshopId,
          totalPrice: 0,
          date: new Date(),
          paymentStatus: false,
          paymentType,
        },
        { transaction: t }
      );
      let totalPrice = 0;

      const selectedServices = await Service.findAll(
        {
          where: {
            id: { [Op.or]: services },
          },
        },
        { transaction: t }
      );

      let orderDetail = [];

      selectedServices.forEach((service) => {
        orderDetail.push({
          OrderId: newOrder.id,
          ServiceId: service.id,
          price: service.price,
        });
        totalPrice += service.price;
      });
      await OrderDetail.bulkCreate(orderDetail, { transaction: t });
      const finalOrder = await Order.update(
        {
          totalPrice,
        },
        {
          where: {
            id: newOrder.id,
          },
          transaction: t,
        }
      );

      await t.commit();

      res.status(201).json({
        message: "Success",
      });
    } catch (error) {
      t.rollback();
      next(error);
    }
  }

  static async getAllOrders(req, res, next) {
    try {
      const orders = await Order.findAll({
        where: {
          WorkshopId: req.user.id, // UserID dari model User yang login
        },
        include: [
          {
            model: OrderDetail,
          },
          {
            model: User,
            attributes: ["name", "username", "email", "imgUrl", "address", "phoneNumber"],
          },
        ],
        order: [["date", "DESC"]],
      });
      res.status(200).json(orders);
    } catch (error) {
      // next(error);
    }
  }

  static async getOrderDetailsById(req, res, next) {
    try {
      const order = await Order.findOne({
        where: {
          id: req.params.OrderId,
        },
        include: [
          {
            model: OrderDetail,
            include: [
              {
                model: Service,
              },
            ],
          },
          {
            model: User,
            attributes: ["name", "username", "email", "imgUrl", "address", "phoneNumber"],
          },
          {
            model: Workshop,
            attributes: ["name", "imgUrl", "address", "phoneNumber"],
          },
        ],
      });
      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = OrderController;
