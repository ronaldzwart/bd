# Project: Content Generator (ronaldzwart.nl)

## Deployment

- **Server**: `46.225.56.233` (Ubuntu VPS, Hetzner)
- **SSH**: `ssh root@46.225.56.233`
- **Webserver**: Nginx
- **URL**: https://www.ronaldzwart.nl
- **Server pad**: `/home/public_html`

### Automatisch deployen

Bij elke push naar `main` wordt automatisch gedeployd via GitHub Actions (rsync naar `/home/public_html/`).

### Handmatig deployen

```bash
scp index.html styles.css app.js proxy.php root@46.225.56.233:/home/public_html/
```

### Eigenaar bestanden op server
- User: `deploy`, Group: `deploy`
- Na handmatig uploaden: `chown -R deploy:deploy /home/public_html`

## Belangrijk
- SSH is NIET beschikbaar vanuit de Claude Code omgeving (geen ssh binary)
- Geef de gebruiker daarom altijd een kant-en-klaar commando om in zijn Mac terminal te plakken
