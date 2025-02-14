const Category = require('../models/Category');

//Get All Categories
const getAllCategories = async (req, res) => {
    try {
        const data = await Category.find();
        res.send(data);
    } catch {
        res.send(error);
    }
}

//Get Category By ID
const getCategoryById = async (req, res) => {
    try {
        const data = await data.findById(req.params.id);
        if (!data) {
            return res.send({ message: "Category Not Found..!" });
        }
        res.json(data);
    } catch (error) {
        res.send(error);
    }
}

//createCategory if the role is admin
const createCategory = async (req, res) => {
    try {
        if (!req.User || req.User.role !== 'admin') {
            return res.status(403).json({ message: "Access Denided Only Admin can Create Category..!" });
        }

        const { category_name, category_description, category_images } = req.body;

        if (!category_name) {
            return res.status(400).json({ message: "Category_name is Required..!" });
        }
        const newCategory = new Category({
            category_name,
            category_description,
            category_images,
            category_updated_at: Date.now()
        });

        await newCategory.save();
        res.send({ message: "Category Created Successfully..!", Category: newCategory });
    }
    catch (error) {
        res.send(error);
    }
};

//Delete Category if the role is admin
const deleteCategory = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.send({ message: "Access Denided Only Admin can Delete Category..!" });
        }

        const data = await Category.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.send({ message: "Category Not Found..!" });
        }
        res.send({ message: "Category Deleted Successfully..!", data: data });

    } catch (error) {
        res.send(error);
    }
};

//Update Categroy if the role is admin
const updateCategory = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied Only Admin can Update Category..!" });
        }

        const categoryId = req.params.id;
        const { category_name, category_description, category_images } = req.body;
        const updateData = {
            ...(category_name && { category_name }),
            ...(category_description && { category_description }),
            ...(category_images && { category_images }),
            category_updated_at: Date.now()
        };

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not Found..!" });
        }

        res.send({ message: "Category updated successfully..!", category: updatedCategory });

    } catch (error) {
        res.send(error);
    }
};

module.exports = { getAllCategories, getCategoryById, createCategory, deleteCategory, updateCategory };
