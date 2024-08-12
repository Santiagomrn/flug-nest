import path from 'path';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { config } from '@config/index';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { User } from '@modules/user/entities/user.entity';
import { Logger } from '@core/logger/Logger';
import { Plain } from '@libraries/baseModel.entity';

@Injectable()
export class MailingService implements OnApplicationShutdown {
  private mailer: nodemailer.Transporter;
  private logger: Logger = new Logger(MailingService.name);

  constructor() {
    this.mailer = nodemailer.createTransport({
      pool: true,
      host: config.email.host,
      port: config.email.port,
      auth: config.email.auth,
      secure: config.email.secure,
    });
  }
  onApplicationShutdown() {
    this.close();
  }
  public async close() {
    this.mailer.close();
  }
  private async send(
    email: string,
    subject: string,
    html: string,
  ): Promise<any> {
    return await this.mailer.sendMail({
      from: config.email.from_address,
      to: email,
      subject: subject,
      html: html,
    });
  }

  private compileTemplate(context: any): Promise<string> {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, './templates/template.ejs'),
        context,
        (err, str) => {
          if (err) return reject(err);
          return resolve(str);
        },
      );
    });
  }

  async sendEmail(
    email: string,
    subject: string,
    page: string,
    context?: any,
  ): Promise<any> {
    try {
      if (context == null) context = {};
      context.page = page;
      const html = await this.compileTemplate(context);

      this.logger.info(`Sending ${page} email to: ${email}`);
      await this.send(email, subject, html);
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async sendConfirmationEmail(user: Plain<User>, token: string) {
    await this.sendEmail(
      user.email,
      'Email confirmation',
      'email_confirmation',
      {
        path: config.urls.base + '/v1/auth/email/confirmation/' + token,
        name: user.firstName,
      },
    );
  }
  async sendResetPasswordTokenEmail(user: Plain<User>, token: string) {
    await this.sendEmail(user.email, 'Password reset', 'email_reset_password', {
      name: user.firstName,
      token: token,
    });
  }
}
