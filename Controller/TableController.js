const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Qrcode = require('qrcode');
const pdfkit = require('pdfkit');
const fs = require('fs');
const dayjs = require('dayjs');

module.exports = {
    create: async (req, res) => {
        try {
            const tableId = req.body.tableId;
            const token = crypto.randomBytes(16).toString('hex');
            const qrUrl = `https://coffe-frontend.vercel.app/order/orderpage?tableId=${tableId}&token=${token}`;
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
    },
    print: async (req, res) => {
        try {
            const tableId = req.body.tableId;
            const table = await prisma.table.findUnique({
                where: {
                    tableId: tableId
                }
            });

            if (!table) {
                return res.status(404).send({ error: "Table not found" });
            }

            const token = table.token || crypto.randomBytes(16).toString('hex'); 
            const qrUrl = `https://coffe-frontend.vercel.app/order/orderpage?tableId=${tableId}&token=${token}`;
            const qrCode = await Qrcode.toDataURL(qrUrl);

            const paperWidth = 80;
            const padding = 3;

            const doc = new pdfkit({
                size: [paperWidth, 200],
                margins: {
                    top: 3,
                    bottom: 3,
                    left: 3,
                    right: 3,
                },
            });

            const fileName = `uploads/table-${tableId}-qr-${dayjs(new Date()).format('YYYYMMDDHHmmss')}.pdf`;
            const font = 'Kanit/Kanit-Reqular.ttf';

            doc.pipe(fs.createWriteStream(fileName));

            // แสดงข้อมูลบน PDF
            doc.font(font);
            doc.fontSize(8).text('Coffee Shop', { align: 'center' });
            doc.fontSize(5).text(`โต๊ะ: ${tableId}`, { align: 'center' });
            doc.text(`วันที่: ${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`, { align: 'center' });
            doc.moveDown();

            // แสดง QR Code
            const qrImageBuffer = Buffer.from(qrCode.split(",")[1], 'base64'); // แปลง Data URL เป็น Buffer
            const qrImageWidth = 60;
            const qrPositionX = (paperWidth - qrImageWidth) / 2;

            doc.image(qrImageBuffer, qrPositionX, doc.y, {
                width: qrImageWidth,
                height: qrImageWidth,
            });

            doc.end();

            return res.send({ message: "PDF created successfully", fileName: fileName });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
};
