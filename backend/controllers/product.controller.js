import ProductModel from '../models/product.model.js';

export const createProductController = async (request, response) => {
    try {
        const {
            name ,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body;

        if(!name || !image [0] || !category[0] || !subCategory[0] || !unit || !price || !description){
            return response.status(400).json({
                message: 'All fields are required',
                error: true,
                success: false
            })
        }

        const product = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        });
        const saveProduct = await product.save();

        return response.json({
            message: 'Product created successfully',
            error: false,
            success: true,
            data: saveProduct
        })

    } catch (error) {
        response.status.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductController = async (request, response) => {
    try {
        let {page, limit, search} = request.body;

        if(!page){
            page:  1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search: search
            }
        }: {}

        const skip = (page - 1) * limit;

        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message: 'Product fetched successfully',
            error: false,
            success: true,
            totalCount : totalCount,
            totalNoPage : Math.ceil(totalCount / limit),
            data: data
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByIdController = async (request, response) => {
    try {
        const {id} = request.body;

        if(!id){
            return response.status(400).json({
                message: 'Product id is required',
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: {$in: id}
        }).limit(15);

        return response.json({
            message: 'Category Product List successfully',
            error: false,
            success: true,
            data: product
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategoryAndSubCategory = async (request, response) => {
    try {
        const {categoryId, subCategoryId,page,limit} = request.body;

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message: 'Provide category and sub category',
                error: true,
                success: false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category: {$in: categoryId},
            subCategory: {$in: subCategoryId}
        }

        const skip = (page- 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.status(200).json({
            message: 'Product fetched successfully',
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            error: false,
            success: true,
            
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductDetails = async (request, response) => {
    try {
        const {productId} = request.body;

        const product = await ProductModel.findOne({_id: productId});

        return response.json({
            message: 'Product details',
            data: product,
            error: false,
            success: true,
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//update product
export const updateProductDetails = async (request, response) => {
    try {
        const {_id} = request.body;

        if(!_id){
            return response.status(400).json({
                message: 'Product id is required',
                error: true,
                success: false
            })
        }

        const updateProduct = await ProductModel.updateOne({_id: _id},{
            ...request.body
        })

        return response.json({
            message: 'Product updated successfully',
            data: updateProduct,
            error: false,
            success: true,
        })

    } catch (error) {
        response.status.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete product
export const deleteProductDetails = async (request, response) => {
    try {
        const {_id} = request.body;

        if(!_id){
            return response.status(400).json({
                message: 'Product id is required',
                error: true,
                success: false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id: _id});

        return response.json({
            message: 'Product deleted successfully',
            data: deleteProduct,
            error: false,
            success: true,
        })
    } catch (error) {
     return response.status(500).json({
         message: error.message || error,
         error: true,
         success: false
     })   
    }
}

export const searchProduct = async (request, response) => {
    try {
        let {search,page,limit} = request.body;

        if(!page){
            page = 1
        }
        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search
            }
        }: {
            
        }

        const skip = (page - 1) * limit
        const [data,datacount] = await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)

        ])

        return response.json({
            message: 'Product fetched successfully',
            data: data,
            totalCount: datacount,
            page: page,
            totalPage: Math.ceil(datacount / limit),
            limit: limit,
            error: false,
            success: true,
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}