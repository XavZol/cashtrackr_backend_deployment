type EmailType = {
    name: string;
    email: string;
    token: string;
};
export declare class AuthEmail {
    static readonly sendConfirmationEmail: (user: EmailType) => Promise<void>;
    static readonly sendPasswordResetToken: (user: EmailType) => Promise<void>;
}
export {};
