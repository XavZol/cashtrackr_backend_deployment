"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    // Nota: Añadí 'readonly' para solucionar la sugerencia de tu editor (la línea naranja en la línea 10)
    static sendConfirmationEmail = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'CashTrackr - Confirma tu Cuenta',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f5f7; margin: 0; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        
                        <div style="background-color: #2A0E4B; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 32px; letter-spacing: 1px;">
                                <span style="color: #ffffff;">Cash</span><span style="color: #F59E0B;">Trackr</span>
                            </h1>
                        </div>
                        
                        <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
                            <h2 style="color: #2A0E4B; font-size: 24px; margin-top: 0;">¡Hola, ${user.name}!</h2>
                            <p style="font-size: 16px;">Has creado tu cuenta en <strong>CashTrackr</strong>. Ya casi está lista, solo necesitamos que confirmes tu correo electrónico para proteger tu información.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="${process.env.FRONTEND_URL}/auth/confirm-account" style="background-color: #F59E0B; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Confirmar Cuenta</a>
                            </div>
                            
                            <p style="font-size: 16px; text-align: center; margin-bottom: 10px;">O ingresa el siguiente código de confirmación de 6 dígitos:</p>
                            
                            <div style="background-color: #f9fafb; border: 2px dashed #2A0E4B; padding: 20px; text-align: center; margin: 0 auto 20px auto; max-width: 250px; border-radius: 8px;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2A0E4B;">${user.token}</span>
                            </div>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0;">Si no solicitaste crear una cuenta, puedes ignorar este correo de forma segura.</p>
                            <p style="margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} CashTrackr. Todos los derechos reservados.</p>
                        </div>

                    </div>
                </div>
            `
        });
        // console.log('Mensaje enviado', email.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'CashTrackr - Reestablece tu Password',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f5f7; margin: 0; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        
                        <div style="background-color: #2A0E4B; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 32px; letter-spacing: 1px;">
                                <span style="color: #ffffff;">Cash</span><span style="color: #F59E0B;">Trackr</span>
                            </h1>
                        </div>
                        
                        <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
                            <h2 style="color: #2A0E4B; font-size: 24px; margin-top: 0;">¡Hola, ${user.name}!</h2>
                            <p style="font-size: 16px;">Has solicitado restablecer tu contraseña en <strong>CashTrackr</strong>. No te preocupes, es muy fácil recuperarla. Haz clic en el botón de abajo para asignar una nueva.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="${process.env.FRONTEND_URL}/auth/new-password" style="background-color: #F59E0B; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Restablecer Contraseña</a>
                            </div>
                            
                            <p style="font-size: 16px; text-align: center; margin-bottom: 10px;">O ingresa el siguiente código de 6 dígitos en la aplicación:</p>
                            
                            <div style="background-color: #f9fafb; border: 2px dashed #2A0E4B; padding: 20px; text-align: center; margin: 0 auto 20px auto; max-width: 250px; border-radius: 8px;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2A0E4B;">${user.token}</span>
                            </div>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0;">Si tú no solicitaste restablecer tu contraseña, por favor ignora este correo. Tu cuenta sigue estando segura.</p>
                            <p style="margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} CashTrackr. Todos los derechos reservados.</p>
                        </div>

                    </div>
                </div>
            `
        });
        // console.log('Mensaje de restablecimiento enviado', email.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map