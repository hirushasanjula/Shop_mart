import e, { Router } from "express";
import auth from "../middleware/auth.js";
import { AddSubCategoryController, deleteSubCategoryController, GetSubCategoryController, updateSubCategoryController } from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create",auth,AddSubCategoryController )
subCategoryRouter.post("/get",auth,GetSubCategoryController )
subCategoryRouter.put("/update",auth,updateSubCategoryController )
subCategoryRouter.delete("/delete",auth,deleteSubCategoryController )

export default subCategoryRouter;