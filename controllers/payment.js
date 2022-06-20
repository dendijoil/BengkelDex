const { Order, Workshop, User, sequelize } = require("../models");
class PaymentController {
  static async doPayment(req, res, next) {
    const t = await sequelize.transaction();
    try {
      //! INGAT, PAKE QUERY!
      const { WorkshopId, UserId } = req.query;

      const userBalance = await User.update(
        { balance: balance - req.body.TotalPrice },
        {
          where: {
            id: UserId,
          },
          transaction: t,
        }
      );

      const balance = await Workshop.update(
        {
          balance: balance + req.body.TotalPrice,
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

      await t.commit();
      res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      t.rollback();
      next(error);
    }
  }
}

module.exports = PaymentController;
