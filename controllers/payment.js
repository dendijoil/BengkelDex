const { Order, Workshop, User, sequelize } = require("../models");
class PaymentController {
  static async doPayment(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { OrderId } = req.params;
      //! INGAT, PAKE QUERY!
      const { WorkshopId, UserId } = req.query;

      const order = await Order.findByPk(OrderId, { transaction: t });
      if (order.paymentType === "cash") {
        await Order.update(
          {
            paymentStatus: true,
          },
          {
            where: {
              id: OrderId,
            },
            transaction: t,
          }
        );
      } else {
        const user = await User.findByPk(UserId, { transaction: t });
        const userBalance = await User.update(
          { balance: user.balance - order.totalPrice },
          {
            where: {
              id: UserId,
            },
            transaction: t,
          }
        );

        const workshop = await Workshop.findByPk(WorkshopId, { transaction: t });
        const balance = await Workshop.update(
          {
            balance: workshop.balance + order.totalPrice,
          },
          {
            where: {
              id: WorkshopId,
            },
            transaction: t,
          }
        );

        const updateStatus = await Order.update(
          {
            paymentStatus: true,
          },
          {
            where: {
              id: req.params.OrderId,
            },
          },
          { transaction: t }
        );
      }
      await t.commit();
      res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      next(error);
    }
  }
}

module.exports = PaymentController;
