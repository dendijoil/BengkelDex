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

  static async topUpBalance(req, res, next) {
    try {
      const { error } = req.body;
      if (error) {
        throw err;
      }

      let parameter = {
        transaction_details: {
          order_id: "BengkelDex_" + Math.floor(Math.random() * 1000000),
          gross_amount: req.body.amount,
        },
        customer_details: {
          first_name: req.user?.fullName.split(" ")[0],
          last_name: req.user?.fullName.split(" ")[1],
          email: req.user?.email,
          phone: "+6281023928095",
        },
        enabled_payments: [
          "credit_card",
          "cimb_clicks",
          "bca_klikbca",
          "bca_klikpay",
          "bri_epay",
          "echannel",
          "permata_va",
          "bca_va",
          "bni_va",
          "bri_va",
          "other_va",
          "gopay",
          "indomaret",
          "danamon_online",
          "akulaku",
          "shopeepay",
        ],
        credit_card: {
          secure: true,
          channel: "migs",
          bank: "bca",
          installment: {
            required: false,
            terms: {
              bni: [3, 6, 12],
              mandiri: [3, 6, 12],
              cimb: [3],
              bca: [3, 6, 12],
              offline: [6, 12],
            },
          },
          whitelist_bins: ["48111111", "41111111"],
        },
      };

      const transaction = await snap.createTransaction(parameter);

      await User.update(
        { balance: req.user.balance + req.body.amount },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      // kayaknya disini ada yang kurang sempurna, kurang paymentStatus
      res.status(200).json({
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
