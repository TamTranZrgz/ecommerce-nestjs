import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const CustomZodValidationPipe: typeof ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    // console.log(error)
    try {
      // console.log(Array.isArray(error.issues)) // should be true
      return new UnprocessableEntityException(
        error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join('.'),
          code: issue.code,
        })),
      )
    } catch (e) {
      console.error('Error mapping issues:', e)
      throw e
    }
  },
})

export default CustomZodValidationPipe
