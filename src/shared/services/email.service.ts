import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from 'src/shared/config'

@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'Admin - Ecommerce <onboarding@resend.dev>',
      to: ['thanh.tam.tran.zrgz@gmail.com'],
      subject: 'OTP code',
      html: `<strong>${payload.code}</strong>`,
    })
  }
}
