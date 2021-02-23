const nodemailer = require("nodemailer")

async function sendEmail(content) {
	let transporter = nodemailer.createTransport({
		host: "smtp-mail.outlook.com", 
		secureConnection: false, 
		port: 587, 
		tls: {
			ciphers: "SSLv3"
		},
		auth: {
			user: process.env.EMAIL, 
			pass: process.env.PASSWORD 
		}
	})

	const { refreshToken, email, message } = content
	const link = `${process.env.ADDRESS}/home/confirmedEmail/${refreshToken}`
	let mailOptions = {
		from: process.env.EMAIL, 
		to: email, 
		subject: "Email de Confirmação",
		html: `
            <h1 style="font-size:16px;">Confirme seu e-mail</h1>
            <p id="form_message" style="font-size:14px;margin:0">${message}</p>
            <a id="linkConfirmation" style="font-size:14px;margin:0" href=${link}>Confirmar e-mail</a>
        `,
	}
	transporter.sendMail(mailOptions, (error) => {
		if (error) {
			console.error(error)
			return error
		}
		return true
	})
}

module.exports = { sendEmail }
