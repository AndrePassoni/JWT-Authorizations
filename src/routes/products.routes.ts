import { Router } from "express"
import { ProductsController } from "@/controllers/products-controller"

import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const productsRoutes = Router()
const productsController = new ProductsController()

// Aplicar autorização em todas as rotas a seguir.
// productsRoutes.use(verifyUserAuthorization(["sale", "admin"]))
productsRoutes.get("/", productsController.index)
productsRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["sale", "admin"]), productsController.create)

export { productsRoutes }
