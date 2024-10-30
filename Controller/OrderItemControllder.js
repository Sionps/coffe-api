const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {

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
    
            return res.send({ message: "success" });
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
            await prisma.order.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            })
            return res.send({ message: "success" })
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    submit: async (req,res) => {
        try {
            await prisma.order.update({
                where:{
                    id: parseInt(req.params.id)
                },
                data: {
                    status: "success"
                }
            })
            return res.send({message: "success"})
        } catch (error) {
            return res.status(500).send({ error : error.message})
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