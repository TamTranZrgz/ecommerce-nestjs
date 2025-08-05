import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from 'src/shared/decorator/auth.decorator'
import { AccessTokenGuard } from './access-token.guard'
import { ApiKeyGuard } from './api-key.guard'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  //   private readonly authTypeGuardMap: Record<string, CanActivate> = {
  //     [AuthType.Bearer]: this.accessTokenGuard,
  //     [AuthType.ApiKey]: this.apiKeyGuard,
  //     [AuthType.None]: { canActivate: () => true },
  //   }
  //   constructor(
  //     private readonly reflector: Reflector,
  //     private readonly accessTokenGuard: AccessTokenGuard,
  //     private readonly apiKeyGuard: ApiKeyGuard,
  //   ) {}

  private readonly authTypeGuardMap: Record<string, CanActivate>
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.ApiKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: () => true },
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('AuthenticationGuard')
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.None], options: { condifiton: ConditionGuard.And } }
    // console.log(111)

    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType])
    // console.log(guards)

    let error = new UnauthorizedException()
    if (authTypeValue.options?.condifiton === ConditionGuard.Or) {
      for (const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
          error = err
          return false
        })
        // console.log(instance, canActivate)

        if (canActivate) {
          return true
        }
      }
      throw error
    } else {
      for (const instance of guards) {
        const canActivate = await instance.canActivate(context)
        if (!canActivate) {
          throw new UnauthorizedException()
        }
      }
      return true
    }
  }
}
