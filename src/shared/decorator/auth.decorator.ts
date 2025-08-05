import { SetMetadata } from '@nestjs/common'
import { AuthTypeType, ConditionGuard, ConditionGuardType } from 'src/shared/constants/auth.constant'

export const AUTH_TYPE_KEY = 'authType'

export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeType[]
  options?: { condifiton: ConditionGuardType }
}

export const Auth = (authTypes: AuthTypeType[], options?: { condifiton: ConditionGuardType }) => {
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, options: options ?? { condifiton: ConditionGuard.And } })
}
