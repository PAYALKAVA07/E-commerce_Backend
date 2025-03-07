const Discount = require('../models/Discount');

//get All Discounts
const getAllDiscount = async (req, res) => {
    try {
        const allDiscount = await Discount.find();
        if (!allDiscount.length) {
            res.send({ message: "No Discounts Found..!" });
        }
        res.send(allDiscount);
    }
    catch (error) {
        res.send(error);
    }
}

//get Discount By Id
const getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            return res.send({ message: "Discount Not Found..!" });
        }
        res.send(discount);
    } catch (error) {
        res.send(error);
    }
}

//insert new discount
// const insertDiscount = async (req, res) => {
//     try {
//         const { discount_type, discount_value,discount_description, discount_startDate, discount_endDate } = req.body;

//         // Check for missing fields
//         if (!discount_type || !discount_value || !discount_description||!discount_startDate || !discount_endDate) {
//             return res.send({ message: "All the Fields are required..!" });
//         }

//         const validTypes = ["percentage", "flat"];
//         if (!validTypes.includes(discount_type)) {
//             return res.send({ message: "Invalid discount type. Use only 'percentage' or 'flat'." });
//         }

//         if (typeof discount_value !== "number" || discount_value <= 0) {
//             return res.send({ message: "Discount value must be a number greater than zero." });
//         }


//         const StartDate = new Date(discount_startDate);
//         const EndDate = new Date(discount_endDate);

//         if (StartDate >= EndDate) {
//             return res.send({ message: "End date must be later than start date." });
//         }

//         const newDiscount = new Discount({
//             discount_type,
//             discount_value,
//             discount_description,
//             discount_startDate: StartDate,
//             discount_endDate: EndDate
//         });

//         await newDiscount.save();
//         res.send({ message: "Discount Created Successfully..!", discount: newDiscount });

//     } 
//     catch (error) {
//         res.send(error);
//     }
// };

const insertDiscount = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging

        const { discount_type, discount_value, discount_description, discount_startDate, discount_endDate } = req.body;

        // Check if req.body is empty or missing fields
        if (!discount_type || !discount_value || !discount_description || !discount_startDate || !discount_endDate) {
            return res.status(400).send({ message: "All fields are required..!" });
        }

        const validTypes = ["percentage", "flat"];
        if (!validTypes.includes(discount_type)) {
            return res.status(400).send({ message: "Invalid discount type. Use only 'percentage' or 'flat'." });
        }

        // Ensure discount_value is a valid number
        const discountValue = Number(discount_value);
        if (isNaN(discountValue) || discountValue <= 0) {
            return res.status(400).send({ message: "Discount value must be a number greater than zero." });
        }

        // Validate date formats
        const StartDate = new Date(discount_startDate);
        const EndDate = new Date(discount_endDate);
        if (isNaN(StartDate.getTime()) || isNaN(EndDate.getTime())) {
            return res.status(400).send({ message: "Invalid date format." });
        }
        if (StartDate >= EndDate) {
            return res.status(400).send({ message: "End date must be later than start date." });
        }

        // Save to database
        const newDiscount = new Discount({
            discount_type,
            discount_value: discountValue,
            discount_description,
            discount_startDate: StartDate,
            discount_endDate: EndDate
        });

        await newDiscount.save();
        res.status(201).send({ message: "Discount Created Successfully..!", discount: newDiscount });

    } catch (error) {
        console.error("Error inserting discount:", error);
        res.status(500).send({ message: "Internal Server Error", error });
    }
};


//update Discount
const updateDiscount = async (req, res) => {
    try {
        let updates = req.body;

        const existingDiscount = await Discount.findById(req.params.id);
        if (!existingDiscount) {
            return res.send({ message: "Discount Not Found..!" });
        }

        if (updates.discount_type) {
            const validTypes = ["percentage", "flat"];
            if (!validTypes.includes(updates.discount_type)) {
                return res.send({ message: "Invalid discount type. Use 'percentage' or 'flat'." });
            }
        }

        if (updates.discount_value !== undefined && updates.discount_value <= 0) {
            return res.send({ message: "Discount value must be greater than zero." });
        }

        let StartDate = updates.start_date ? new Date(updates.start_date) : existingDiscount.start_date;
        let EndDate = updates.end_date ? new Date(updates.end_date) : existingDiscount.end_date;

        if (StartDate >= EndDate) {
            return res.send({ message: "End date must be greater than start date." });
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(
            req.params.id, 
            { ...updates, discount_startDate: StartDate, discount_endDate: EndDate }, 
            { new: true }
        );

        res.send({ message: "Discount updated successfully", discount: updatedDiscount });
    } 
    catch (error) {
        res.send(error);
    }
}

//delete Discount
const deleteDiscount = async(req, res) => {
    try {
        const deletedDiscount = await Discount.findByIdAndDelete(req.params.id);
        if (!deletedDiscount) {
            return res.send({ message: "Discount not found..!" });
        }
        res.send({ message: "Discount Deleted Successfully,,!", deletedDiscount });
    } 
    catch (error) {
        res.send(error);
    }
}

module.exports = {getAllDiscount,getDiscountById,insertDiscount,updateDiscount,deleteDiscount};