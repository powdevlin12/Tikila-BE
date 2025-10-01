import axios from 'axios'
import { config } from 'dotenv'
import { envConfig } from '~/constants/config'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import {
  FollowReqBody,
  RegisterRequestBody,
  UnfollowReqParams,
  UpdateMeReqBody
} from '~/models/schemas/requests/User.request'
import User from '~/models/schemas/User.schema'
import { ISignToken } from '~/types/users/signToken'
import { IRefreshTokenParameter } from '~/types/users/userServiceParameter'
import { hashPassword } from '~/utils/cryto'
import { signToken } from '~/utils/jwt'
import refreshTokenService from './refreshToken.service'
import typeormService from './typeorm.service'
import { generateId } from '~/utils/gererator'
config()

class UserServiceTypeORM {
  private signAccessToken({ user_id, verify }: ISignToken) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      privateKey: envConfig.secretAccessToken,
      options: { algorithm: 'HS256', expiresIn: envConfig.accessTokenExpireIn }
    })
  }

  private signRefreshToken({ user_id, verify, exp }: ISignToken) {
    if (exp) {
      return signToken({
        payload: { user_id, token_type: TokenType.RefreshToken, verify, exp },
        privateKey: envConfig.secretRefreshToken as string,
        options: { algorithm: 'HS256' }
      })
    }
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      privateKey: envConfig.secretRefreshToken,
      options: { algorithm: 'HS256', expiresIn: envConfig.refreshTokenExpireIn }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: ISignToken) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      privateKey: envConfig.secretEmailVerifyToken,
      options: { algorithm: 'HS256', expiresIn: envConfig.emailVerifyTokenExprireIn }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: ISignToken) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      privateKey: envConfig.secretForgotPasswordVerifyToken,
      options: { algorithm: 'HS256', expiresIn: envConfig.forgotVerifyTokenExprireIn }
    })
  }

  private async signAccessAndRefreshToken({ user_id, verify }: ISignToken) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify })
    ])
    return { accessToken, refreshToken }
  }

  async checkEmailExists(email: string) {
    const user = await typeormService.userRepository.findOne({
      where: { email }
    })
    return !!user
  }

  async login(user_id: string) {
    const token = await this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify: 1 })
    const decode_refresh_token = await refreshTokenService.decodeRefreshToken(token.refreshToken)

    await refreshTokenService.createRefeshToken({
      user_id: user_id,
      token: token.refreshToken,
      iat: decode_refresh_token.iat,
      exp: decode_refresh_token.exp
    })
    return { accessToken: token.accessToken, refreshToken: token.refreshToken }
  }

  async logout(refreshToken: string) {
    await typeormService.refreshTokenRepository.delete({ token: refreshToken })
    return { message: USER_MESSAGE.LOGOUT_SUCCESSFULLY }
  }

  async getUserByEmail(email: string) {
    return await typeormService.userRepository.findOne({
      where: { email }
    })
  }

  async getUserById(id: string) {
    return await typeormService.userRepository.findOne({
      where: { id }
    })
  }

  async createUser(userData: { name: string; email: string; password: string }) {
    const user = typeormService.userRepository.create({
      id: generateId(),
      name: userData.name,
      email: userData.email,
      password: hashPassword(userData.password)
    })

    return await typeormService.userRepository.save(user)
  }

  async updateUser(id: string, updateData: Partial<{ name: string; email: string; password: string }>) {
    if (updateData.password) {
      updateData.password = hashPassword(updateData.password)
    }

    await typeormService.userRepository.update(id, updateData)
    return await this.getUserById(id)
  }

  async getAllUsers() {
    return await typeormService.userRepository.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    })
  }

  async deleteUser(id: string) {
    await typeormService.userRepository.delete(id)
    return { message: 'User deleted successfully' }
  }
}

export default new UserServiceTypeORM()
