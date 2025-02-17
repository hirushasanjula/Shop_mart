import SubCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryController = async (request,response) => {
    try {
        const {name, image, category} = request.body

        if(!name && !image && !category[0]){
            return response.status(400).json({
                message : "Please fill all fields",
                error : true,
                success : false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload)
        const save = await createSubCategory.save()

        response.json({
            message : "Sub Category Created",
            data : save,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const GetSubCategoryController = async (request,response) => {
    try {
        const data = await SubCategoryModel.find().sort({createdAt : -1}).populate('category')
        return response.json({
            message : "Sub Category data",
            data : data,
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateSubCategoryController = async(request,response) => {
    try {
        const {_id,name, image, category} = request.body

        const checkSub = await SubCategoryModel.findById(_id)

        if(!checkSub){
            return response.status(404).json({
                message : "Sub Category not found",
                error : true,
                success : false
            })
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        return response.json({
            message : "Sub Category Updated Successfully",
            data : updateSubCategory,
            success : true,
            error : false
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteSubCategoryController = async(request,response) => {
    try {
        const {_id} = request.body

        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

        return response.json({
            message : "Sub Category Deleted Successfully",
            data : deleteSub,
            success : true,
            error : false
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}