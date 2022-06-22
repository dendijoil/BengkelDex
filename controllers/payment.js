const { Order, Workshop, User, sequelize } = require("../models");
const snap = require("../services/midtrans/index");
const axios = require("axios");

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
      t.rollback();
      next(error);
    }
  }

  static async topUpBalance(req, res, next) {
    try {
      let inputAmount = +req.body.amount;
      let parameter = {
        transaction_details: {
          order_id: "BengkelDex_" + Math.floor(Math.random() * 1000000) + `_${req.user.username}`,
          user_username: req.user.username,
          gross_amount: Number(req.body.amount),
        },
        customer_details: {
          name: req.user.name,
          username: req.user.username,
          phone: req.user.phoneNumber,
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

      // const transaction = await snap.createTransaction(parameter);

      let { data } = await axios({
        method: "post",
        url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Basic U0ItTWlkLXNlcnZlci1zZWRQRVRrUGZBRlp0WEgycHc2RUp0eHo6",
          Authorization: "Basic U0ItTWlkLXNlcnZlci1zZWRQRVRrUGZBRlp0WEgycHc2RUp0eHo=:",
        },
        data: parameter,
      });

      console.log(data);

      req.inputAmount = inputAmount;

      res.status(200).json({
        token: data.token,
        redirect_url: data.redirect_url,
        inputAmount,
      });
    } catch (err) {
      console.log(err.response.data);
      next(err);
    }
  }

  static async updateBalance(req, res, next) {
    try {
      const inputAmount = req.inputAmount;
      console.log(req.body);
      let { transaction_status, order_id, gross_amount } = req.body;
      const orderData = order_id.split("_");

      const username = orderData[2];
      console.log(username);
      if (transaction_status === "settlement" || transaction_status === "capture") {
        const user = await User.findOne({
          where: {
            username,
          },
        });

        await User.update(
          { balance: user.balance + Number(gross_amount) },
          {
            where: {
              username,
            },
          }
        );
      }
      res.status(200).json({ message: "Success" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
