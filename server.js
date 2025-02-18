require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do transporte do Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Rota para receber o agendamento e enviar e-mail
app.post("/agendar", async (req, res) => {
    const { name, date, time } = req.body;

    if (!name || !date || !time) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "maylarodrigues2018@gmail.com", 
        subject: "Novo Agendamento Recebido",
        text: `Nome: ${name}\nData: ${date}\nHorário: ${time}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Agendamento enviado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao enviar o e-mail." });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
