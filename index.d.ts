import {Transporter} from "nodemailer";

export interface Config {
    host: string;
    port: number;
    secure: boolean;
    auth: Auth;
    tls: TLS;
}

export interface Languages {
    id: string;
    subject: string;
    html: string;
  }

export interface Templates {
    id: string;
    from: string;
    languages: Languages[];
}

export interface Auth {
    user: string;
    pass: string;
}

export interface TLS {
    rejectUnauthorized: boolean;
}   

export function init(config: Config, templates: Templates []): Promise<void>;
export function send(mailId: string, to: string, language: string, data: any): Promise<Transporter>;
