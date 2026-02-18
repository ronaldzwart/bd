# Project: Content Generator (ronaldzwart.nl)

## Deployment

- **Hosting**: Hetzner Shared Hosting (konsoleH)
- **Server**: `www601.your-server.de` (IP: `162.55.254.99`)
- **FTP user**: `ronaldzwart@gmail.com`
- **URL**: https://www.ronaldzwart.nl
- **Document root**: `/` (op de hosting)

### Automatisch deployen

Bij elke push naar `main` wordt automatisch gedeployd via GitHub Actions (FTP naar document root).

GitHub Secrets benodigd:
- `FTP_SERVER` = `www601.your-server.de`
- `FTP_USERNAME` = `ronaldzwart@gmail.com`
- `FTP_PASSWORD` = *(FTP wachtwoord)*

### Handmatig deployen

Upload via FTP-client (bijv. FileZilla) naar de document root:
- Server: `www601.your-server.de`
- Gebruiker: `ronaldzwart@gmail.com`
- Bestanden: `index.html`, `styles.css`, `app.js`, `proxy.php`

## Belangrijk
- Dit is shared hosting, GEEN VPS — er is geen SSH beschikbaar
- Deploy gaat via FTP (niet rsync)
- SSH is NIET beschikbaar vanuit de Claude Code omgeving (geen ssh binary)
- Geef de gebruiker daarom altijd een kant-en-klaar commando om in zijn Mac terminal te plakken
