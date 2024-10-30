const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Qrcode = require('qrcode');
const crypto = require('crypto');

module.exports = {
    create: async (req, res) => {
        try {
            const tableId = req.body.tableId;
            const token = crypto.randomBytes(16).toString('hex');
            const qrUrl = `https://coffe-frontend-auk47hf00-sionps-projects.vercel.app/order/orderpage?tableId=${tableId}&token=${token}`;
            const qrCode = await Qrcode.toDataURL(qrUrl);

            await prisma.table.create({
                data: {
                    tableId: tableId,
                    qrcode: qrCode,
                    token: token,
                    status: "use"
                }
            });

            return res.send({ message: "success" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    list: async (req, res) => {
        try {
            const rows = await prisma.table.findMany({
                where: {
                    status: "use"
                },
                orderBy: {
                    id: "desc"
                }
            });
            return res.send({ results: rows });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    remove: async (req, res) => {
        try {
            await prisma.table.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            });
            return res.send({ message: "success" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    verify: async (req, res) => {
        try {
          const { tableId, token } = req.query;
          const table = await prisma.table.findFirst({
            where: {
              tableId: parseInt(tableId),
              token: token,
              status: "use",
            },
          });
    
          if (table) {
            return res.send({ valid: true });
          } else {
            return res.send({ valid: false });
          }
        } catch (error) {
          return res.status(500).send({ error: error.message });
        }
    }
};
