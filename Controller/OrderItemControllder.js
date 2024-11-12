const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const pdfkit = require('pdfkit');
const fs = require('fs');
const dayjs = require('dayjs');
let io

const initialize = (socketIo) => {
    io = socketIo;
};
  

module.exports = {
    initialize,
    createMysteryItem: async (req, res) => {
        try {
            const tableId = parseInt(req.body.tableId);
            await prisma.orderItem.create({
                data: {
                    name: "ธาราแห่งความพิศวง",
                    menuId: null,
                    tableId: tableId,
                    price: 79,
                    sizeId: req.body.sizeId || null,
                    milkId: req.body.milkId || null,
                    tasteId: req.body.tasteId || null,
                    temperatureId: req.body.temperatureId || null,
                    quantity: 1,
                    orderId: null,
                    comment: req.body.comment,
                    beanType: req.body.beanType || null, 
                    roastMethod: req.body.roastMethod || null 
                }
            });
            return res.send({ message: "Mystery item created successfully!" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const tableId = parseInt(req.body.tableId);
            await prisma.orderItem.create({
                data: {
                    name: req.body.name,
                    menuId: req.body.menuId,
                    tableId: tableId,
                    price: req.body.price,
                    sizeId: req.body.sizeId || null,
                    milkId: req.body.milkId || null,
                    tasteId: req.body.tasteId || null,
                    temperatureId: req.body.temperatureId || null,
                    beanType: req.body.beanType || null,
                    roastMethod: req.body.roastMethod || null,
                    quantity: req.body.quantity,
                    orderId: null,
                    comment: req.body.comment
                }
            })
            return res.send({ message: "success" })
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },
    list: async (req, res) => {     
        const tableId = parseInt(req.query.tableId)
        try {
            const rows = await prisma.orderItem.findMany({
                where: {
                    status: "use",
                    tableId: tableId
                },
                orderBy: {
                    price: "desc"
                },
                include: {
                    menu: {
                        include: {
                            sizes: true,
                            tastes: true,
                            temperatures: true,
                            milkTypes: true
                        }
                    },
                    size: true,
                    milk: true,
                    taste: true,
                    temperature: true
                }
            })
            return res.send({ results: rows })
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },

    remove: async (req, res) => {
        try {
            await prisma.orderItem.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            })
            return res.send({ message: "success" })
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },

    update: async (req, res) => {
        try {
            await prisma.orderItem.update({
                data: {
                    name: req.body.name,
                    menuId: req.body.menuId,
                    price: req.body.price,
                    sizeId: req.body.sizeId || null,
                    milkId: req.body.milkId || null,
                    tasteId: req.body.tasteId || null,
                    temperatureId: req.body.temperatureId || null,
                    quantity: req.body.quantity
                },
                where: {
                    id: req.body.id
                }
            })
            return res.send({ message: "success" })
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },

    createOrder: async (req, res) => {
        try {
            const order = await prisma.order.create({
                data: {
                    tableId: parseInt(req.body.tableId),
                    totalPrice: req.body.totalPrice
                }
            });


            await prisma.orderItem.updateMany({
                where: {
                    tableId: parseInt(req.body.tableId),
                    orderId: null
                },
                data: {
                    orderId: order.id,
                    status: "success"
                }
            });

            io.emit("new_order", { 
                id: order.id,
                tableId: order.tableId,
                totalPrice: order.totalPrice
              });

            return res.send({ message: "success" })
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    

    listOrder: async (req, res) => {
        try {
            const rows = await prisma.order.findMany({
                where: {
                    status: "pending"
                },
                include: {
                    table: true,
                    items: {
                        include: {
                            menu: true,
                            size: true,
                            milk: true,
                            taste: true,
                            temperature: true
                        }
                    }
                }
            })
            return res.send({ results: rows })
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    removeOrder: async (req, res) => {
        try {
            const order = await prisma.order.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            });
            await prisma.orderItem.deleteMany({
                where: {
                    tableId: order.tableId
                }
            });
                await prisma.order.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            });
    
            return res.send({ message: "success" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    

    submit: async (req, res) => {
        try {
            // Find the order first to get the tableId
            const order = await prisma.order.findUnique({
                where: {
                    id: parseInt(req.params.id)
                }
            });

            await prisma.order.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status: "success"
                }
            });
    
            // Create a bill for the order
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
            const fileName = `uploads/bill-${dayjs(new Date()).format('YYYYMMDDHHmmss')}.pdf`;
            const font = './Kanit/Kanit-Regular.ttf';
    
            doc.pipe(fs.createWriteStream(fileName));
    
            // display logo
            const imageWidth = 20;
            const positionX = (paperWidth / 2) - (imageWidth / 2);
            doc.image('uploads/' + 'promptpay.jpg', positionX, 5, {
                align: 'center',
                width: imageWidth,
                height: 20
            });
            doc.moveDown();
    
            doc.font(font);
            doc.fontSize(5).text('*** ใบแจ้งรายการ ***', 20, doc.y + 8);
            doc.fontSize(8);
            doc.text("Coffe Shop", padding, doc.y);
            doc.fontSize(5);
            doc.text(911);
            doc.text(`เบอร์โทร: 097-918-0021`);
            doc.text(`เลขประจำตัวผู้เสียภาษี: 911`);
            doc.text(`โต๊ะ: ${order.tableId}`, { align: 'center' });
            doc.text(`วันที่: ${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`, { align: 'center' });
            doc.text('รายการอาหาร', { align: 'center' });
            doc.moveDown();
    
            const y = doc.y;
            doc.fontSize(4);
            doc.text('รายการ', padding, y);
            doc.text('ราคา', padding + 18, y, { align: 'right', width: 20 });
            doc.text('จำนวน', padding + 36, y, { align: 'right', width: 20 });
            doc.text('รวม', padding + 55, y, { align: 'right' });
    
            // line
            // set border height
            doc.lineWidth(0.1);
            doc.moveTo(padding, y + 6).lineTo(paperWidth - padding, y + 6).stroke();
    
            // loop order items
            let sumAmount = 0;
            const orderItems = await prisma.orderItem.findMany({
                where: {
                    orderId: order.id
                }
            });
    
            orderItems.forEach((item) => {
                const y = doc.y;
                doc.text(item.name, padding, y);
                doc.text(item.price, padding + 18, y, { align: 'right', width: 20 });
                doc.text(item.quantity, padding + 36, y, { align: 'right', width: 20 });
                doc.text(item.price * item.quantity, padding + 55, y, { align: 'right' });
                sumAmount += item.price * item.quantity;
            });
    
            // display amount
            doc.text(`รวม: ${sumAmount.toLocaleString('th-TH')} บาท`, { align: 'right' });
            doc.end();
    
            await prisma.bill.create({
                data: {
                    orderId: order.id,
                    fileName: fileName,
                    totalAmount: sumAmount,
                    createdAt: new Date()
                }
            });
    
            // Delete order items related to the table
            await prisma.orderItem.deleteMany({
                where: {
                    tableId: order.tableId,
                    orderId: order.id
                }
            });
    
            return res.send({ message: "success", fileName: fileName });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },
    

    
    getTotalRevenue: async (req, res) => {
        try {
            const revenue  = await prisma.order.aggregate({
                _sum: {
                    totalPrice: true
                },
                where: {
                    status: "success"
                }
            })
            return res.send({totalRevenue: revenue._sum.totalPrice})
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    },

    listByDate: async (req, res) => {
        try {
            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);
    
            if (isNaN(startDate) || isNaN(endDate)) {
                return res.status(400).send({ error: "Invalid startDate or endDate" });
            }
    
            const rows = await prisma.order.findMany({
                where: {
                    status: "success",
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
                include: {
                    table: true,
                    items: {
                        include: {
                            menu: {
                                include: {
                                    sizes: true,
                                    tastes: true,
                                    temperatures: true,
                                    milkTypes: true,
                                },
                            },
                            size: true,
                            milk: true,
                            taste: true,
                            temperature: true,
                        },
                    },
                },
            });
    
            return res.send({ results: rows });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
}