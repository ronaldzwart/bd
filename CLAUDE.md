# Project: Content Generator (ronaldzwart.nl)

## Deployment

- **Server**: `46.225.56.233` (Ubuntu VPS, Hetzner)
- **SSH**: `ssh root@46.225.56.233`
- **Webserver**: Nginx

### Paden op de server

| Site | URL | Server pad |
|------|-----|------------|
| Productie | https://www.ronaldzwart.nl | `/home/public_html` |
| Test | https://test.ronaldzwart.nl | `/home/public_html/test` |

### Bestanden deployen

Na wijzigingen in dit repo, deploy naar de server met:

```bash
# Deploy naar test
scp index.html styles.css app.js root@46.225.56.233:/home/public_html/test/

# Deploy naar productie
scp index.html styles.css app.js root@46.225.56.233:/home/public_html/
```

Of als je al op de server bent (ssh root@46.225.56.233):

```bash
# Bestanden staan in:
# /home/public_html/          (www.ronaldzwart.nl)
# /home/public_html/test/     (test.ronaldzwart.nl)
```

### Eigenaar bestanden op server
- User: `deploy`, Group: `deploy`
- Na handmatig uploaden: `chown -R deploy:deploy /home/public_html`

## Belangrijk
- SSH is NIET beschikbaar vanuit de Claude Code omgeving (geen ssh binary)
- Geef de gebruiker daarom altijd een kant-en-klaar commando om in zijn Mac terminal te plakken
- www.ronaldzwart.nl en test.ronaldzwart.nl zijn aparte mappen (niet dezelfde)
