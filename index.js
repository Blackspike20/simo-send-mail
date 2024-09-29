const fs = require('fs');
const schema = require('./schema');
const Ajv = require('ajv');
const nodemailer = require('nodemailer');
const mustache = require('mustache');

let transporter;
let mails = [];

/**
 * Create a transport of nodemailer and save in memory the selected templates 
 * @param {object} config - json of transpoer nodemailer configuration
 * @param {array} templates - array json of templates
 * @returns {Promise<void>}
 *
 * @example
 * let config = {
 *   host: 'server.com',
 *   port: '445',
 *   secure: true
 *   auth: {
 *       user: 'test',
 *       pass: 'pass'
 *   }
 * };
 * let templates = [
 *       {
 *           id: 'MAIL IDENTIFIER',
 *           from: 'email@domain.com',
 *           languages: [
 *               {
 *                   id: 'es',
 *                   subject: 'test {{name}}.',
 *                   html: 'templates/email.html'
 *               }
 *               ]
 *       }
 *   ]
 * await mail.init(config,templates);
 */
let init = async (config, templates) => {

    if (typeof config !== "object") {
        throw new Error('simo-send-mail config does not an object');
    }

    if (typeof templates !== "object") {
        throw new Error('simo-send-mail templates does not an object');
    }

    let ajv = new Ajv();
    let validate = ajv.compile(schema);
    if (!validate(templates)){
        throw new Error('simo-send-mail object templates does not valid ' + JSON.stringify(validate.errors));
    }

    transporter = await nodemailer.createTransport(config);
    mails = templates;

    for (let i in mails) {
        for (let x in mails[i]['languages']) {
            if (Object.prototype.hasOwnProperty.call(mails[i]['languages'], x)) {
                let thtml = fs.readFileSync(mails[i]['languages'][x]['html']);
                mails[i]['languages'][x]['htmlContent'] = String(thtml);
            }
        }
    }
};

/**
 * Send a custom email with selected language
 * @param {string} mailId - Template Identifier
 * @param {string to - Email receptor
 * @param {string} language - Email language
 * @param {object} data - json with custom fields
 * @returns {Promise<any>}
 *
 * @example
 * await mail.send('MAIL IDENTIFIER','email@domain.com','es',{field:'test'}); * await
 */
let send = async (mailId, to, language, data= {}) => {
    let mail = mails.find(o => o.id === mailId);
    if (!mail){
        throw new Error('simo-send-mail mailID not found');
    }

    let mailText = mail['languages'].find(o => o.id === language);
    if (!mailText){
        throw new Error('simo-send-mail language not found');
    }

    let subject = mustache.render(mailText['subject'], data);
    let html = mustache.render(mailText['htmlContent'], data);

    return await transporter.sendMail({
        from: mail['from'],
        to: to,
        subject: subject,
        html: html
    });
}

module.exports = {
    init,
    send
}