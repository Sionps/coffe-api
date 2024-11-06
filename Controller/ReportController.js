const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');

module.exports = {
    sumPerDayInYearAndMonth: async (req, res) => {
        try {
            const year = req.body.year;
            const month = req.body.month;

            const sumPerDay = [];
            const startDate = dayjs(`${year}-${month}-01`);
            const endDate = startDate.endOf('month');

            for (let day = startDate.date(); day <= endDate.date(); day++) {
                const dateFrom = startDate.date(day).format('YYYY-MM-DD');
                const dateTo = startDate.date(day).add(1, 'day').format('YYYY-MM-DD');

                // Find all bills within the date range
                const bills = await prisma.bill.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(dateFrom),
                            lt: new Date(dateTo) // lt for exclusive upper bound
                        }
                    },
                    include: {
                        order: {
                            include: {
                                items: true // Include OrderItems if needed for further calculations
                            }
                        }
                    }
                });

                let sum = 0;

                // Calculate the total amount from each order associated with the bills
                for (const bill of bills) {
                    sum += bill.totalAmount; // Using totalAmount from Bill
                }

                sumPerDay.push({
                    date: dateFrom,
                    amount: sum
                });
            }

            res.json({ results: sumPerDay });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    sumPerMonthInYear: async (req, res) => {
        try {
            const year = req.body.year;
            const sumPerMonth = [];

            for (let month = 1; month <= 12; month++) {
                const startDate = dayjs(`${year}-${month}-01`);
                const endDate = startDate.endOf('month');

                const bills = await prisma.bill.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(startDate),
                            lt: new Date(endDate.add(1, 'day')) // exclusive upper bound for month-end
                        },
                        status: 'use'
                    },
                    include: {
                        order: true // Include Order for potential future use
                    }
                });

                let sum = 0;

                for (const bill of bills) {
                    sum += bill.totalAmount; // Sum up the totalAmount directly from Bill
                }

                sumPerMonth.push({
                    month: startDate.format('MM'),
                    amount: sum
                });
            }

            res.json({ results: sumPerMonth });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
