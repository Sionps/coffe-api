const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    create: async (req, res) => {
        try{
            await prisma.taste.create({
                data:{
                    level: req.body.level,
                    comment: req.body.comment,
                    status: "use"
                }
            })

            return res.status(200).send({message: "success"})
        }catch(e){
            return res.status(500).send({ error : e.message})
        }
    },

    list: async (req,res) => {
        try {
            const rows = await prisma.taste.findMany({
                where: {
                    status: "use"
                },
                orderBy:{
                    id: "desc"
                }
            })
            return res.send({ results: rows})
        } catch (e) {
            return res.status(500).send({ error : e.message})
        }
    },

    remove: async (req ,res) => {
        try {
            await prisma.taste.update({
                data: {
                    status: "delete"
                },
                where: {
                    id: parseInt(req.params.id)
                }
            })
            return res.send({message: "success"})
        } catch (e) {
            return res.status(500).send({ error : e.message})
        }
    },

    update: async (req,res) => {
        try {
            await prisma.taste.update({
                data: {
                    level: req.body.level,
                    comment: req.body.comment
                },
                where:{
                    id: req.body.id
                }
            })
            return res.send({message: "success"})
        } catch (e) {
            return res.status(500).send({ error : e.message})
        }
    }
}