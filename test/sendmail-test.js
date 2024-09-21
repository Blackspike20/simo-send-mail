let chai = require('chai');
const nodemailer = require('nodemailer');

let assert = chai.assert;
let mail = require('../index');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

let config = {
    host: 'email.server.com',
    port: 465,
    secure: true,
    auth: {
        user: 'user',
        pass: "xxxx"
    }
};

let templates = [{
    id: 'MAIL IDENTIFIER',
    from: 'email@domain.com',
    languages: [{
        id: 'es',
        subject: 'test {{name}}.',
        html: './templates/email.html'
    }]
},{
    id: 'MAIL IDENTIFIER 2',
    from: 'email@domain.com',
    languages: [{
        id: 'es',
        subject: 'test {{name}}.',
        html: './templates/email.html'
    }]
}];

describe('Tests simo-send-email', function() {
    it('init - config undefined', async function() {
        try {
            await mail.init();
            assert.equal(true, false);
        } catch (e) {
            assert.include(e.message, 'simo-send-mail config does not an object');
        }
    });

    it('init - templates undefined', async function() {
        try {
            await mail.init(config,);
            assert.equal(true, false);
        } catch (e) {
            assert.include(e.message, 'simo-send-mail templates does not an object');
        }
    });

    it('init - templates not an object', async function() {
        try {
            await mail.init(config,'hi');
            assert.equal(true, false);
        } catch (e) {
            assert.include(e.message, 'simo-send-mail templates does not an object');
        }
    });

    it('init - simo-send-mail object templates does not valid', async function() {
        try {
            await mail.init(config,{hi:'hi'});
            assert.equal(true, false);
        } catch (e) {
            assert.include(e.message, 'simo-send-mail object templates does not valid');
        }
    });

    it('init - OK', async function() {
        await mail.init(config, templates);
    });

    it('send - simo-send-mail mailID not found', async function() {
        try {
            await mail.send('hi');
            assert.equal(true, false);
        } catch (e) {
            assert.include(e.message, 'simo-send-mail mailID not found');
        }
    });

    it('send - simo-send-mail language not found', async function() {
        try {
            await mail.send('MAIL IDENTIFIER','','hi');
            assert.equal(true, false);
        } catch (e) {
            assert.include(e.message, 'simo-send-mail language not found');
        }
    });

    it('send - KO transport Error', async function() {
        const transport = {
            sendMail: (data, callback) => {
              return new Promise((resolve, reject) => {
                // do some async task
                //resolve();
                reject(new Error("Invalid login: 535 Authentication Credentials Invalid"));
             });

            }
          };
        sandbox.stub(nodemailer, 'createTransport').returns(transport);

        await mail.init(config, templates);
        try{
            await mail.send('MAIL IDENTIFIER','email@domain.com','es',{field:'test'});
        }
        catch(err){
            assert.include(err.message, 'Invalid login: 535 Authentication Credentials Invalid');
        }

        sandbox.restore();

    });
    
    it('send - OK', async function() {
        const transport = {
            sendMail() {
                return new Promise((resolve) => {
                    resolve();
                });
            }
        };
        sandbox.stub(nodemailer, 'createTransport').returns(transport);
        await mail.init(config, templates);
        await mail.send('MAIL IDENTIFIER','email@domain.com','es',{field:'test'});
    });

});