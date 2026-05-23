import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { authConfig } from "@/configs/auth"
import { sign } from "jsonwebtoken"

class SessionsController {
  async create(request: Request, response: Response) {
    const { username, password } = request.body

    const fakeUser = {
      id: "1",
      username: "john_doe",
      password: "123456",
      role: "sale",
    }

    if(username !== fakeUser.username || password !== fakeUser.password) {
      throw new AppError("Invalid username or password", 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({ role: fakeUser.role }, secret, {
      expiresIn,
      subject: fakeUser.id.toString(),
     })

    return response.status(201).json({ token })
  }
}

export { SessionsController }
