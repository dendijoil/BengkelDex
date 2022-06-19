const { Order, Workshop, sequelize } = require("../models");
class PaymentController {
  static async doPayment(req, res) {
    const t = await sequelize.transaction();
    try {
      // Tambahin transaction pengurangan saldo User

      // Tamabhin transaction penambahan saldo Workshop

      const balance = await Workshop.update(
        {
          balance: balance + req.bodyTotalPrice,
        },
        { transaction: t }
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
    }
  }
}

module.exports = PaymentController;
