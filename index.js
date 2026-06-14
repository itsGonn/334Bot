const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤖 El Bot de Arcor Varios está encendido y patrullando de forma autónoma.');
});

app.listen(PORT, () => {
    console.log(`🌍 Servidor web escuchando en el puerto ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "!";

client.once('ready', () => {
    console.log(`✅ Conectado exitosamente como: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/+/);
    const command = args.shift().toLowerCase();

    if (command === 'clear' || command === 'clean') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ No tenés los permisos necesarios para ejecutar este comando.');
        }

        const cantidad = parseInt(args[0], 10);
        if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
            return message.reply('⚠️ Decime cuántos mensajes querés borrar. Ej: `!clear 20` (Máximo 100).');
        }

        try {
            const mensajesAbuscar = cantidad + 1;
            const borrados = await message.channel.bulkDelete(mensajesAbuscar, true);
            
            const aviso = await message.channel.send(`🧹 Canal desinfectado con éxito. Se borraron **${borrados.size - 1}** mensajes.`);
            setTimeout(() => aviso.delete().catch(() => {}), 3000);
        } catch (error) {
            console.error('Error al purgar canal:', error);
            message.channel.send('❌ Hubo un error al intentar borrar los mensajes.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);