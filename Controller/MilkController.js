const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    create: async (req, res) => {
        try {
            await prisma.milk.create({
                data: {
                    name: req.body.name,
                    price: req.body.price,
                    comment: req.body.comment,
                    status: "use"
                }
            })
            return res.status(200).send({message: "success"})
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    },

    list: async (req, res) => {
        try {
            const rows = await prisma.milk.findMany({
                where: {
                    status: "use"
                },
                orderBy: {
                    price: "desc"
                }
            })
            return res.send({ results: rows})
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    },

     remove: async (req, res) => {
        try {
            await prisma.milk.update({
                data: {
                    status: "delete"
                },
                where: {
                    id: parseInt(req.params.id)
                }
            })
            return res.send({message: "success"})
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    },

    update: async (req, res) => {
        try {
            await prisma.milk.update({
                data: {
                    name: req.body.name,
                    price: req.body.price,
                    comment: req.body.comment
                },
                where: {
                    id : req.body.id
                }
            })
            return res.send({message: "success"})
        } catch (error) {
            return res.status(500).send({ error : error.message})
        }
    }
}
