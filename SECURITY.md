# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Shazam for Gurbani seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please Do

**Report security vulnerabilities by emailing:** security@example.com

Please include the following information:

- Type of vulnerability (e.g., SQL injection, XSS, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will send you regular updates about our progress
- **Timeline**: We aim to patch critical vulnerabilities within 7 days
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### For Developers

1. **Never commit sensitive data**
   - No API keys, passwords, or credentials in code
   - Use `.env` files (never committed to git)
   - Review commits before pushing

2. **Input validation**
   - Validate and sanitize all user inputs
   - Use parameterized queries for database operations
   - Escape output to prevent XSS

3. **Dependencies**
   - Keep all dependencies up to date
   - Regularly run `npm audit` and `pip-audit`
   - Review security advisories

4. **Authentication & Authorization**
   - Use strong password policies
   - Implement rate limiting
   - Validate permissions on all endpoints

### For Users/Deployers

1. **Environment Configuration**
   - Use strong database passwords
   - Change default credentials
   - Restrict database access to localhost when possible
   - Use environment variables for secrets

2. **Network Security**
   - Use HTTPS in production
   - Configure CORS appropriately
   - Use firewall rules to restrict access
   - Keep MySQL port (3306) closed to external access

3. **File Uploads**
   - This application accepts audio file uploads
   - Validate file types on server-side
   - Limit file sizes (default: 10MB)
   - Scan uploaded files if possible

4. **API Keys**
   - Keep your Gemini API key secure
   - Rotate API keys regularly
   - Monitor API usage for anomalies

5. **Regular Updates**
   - Keep Python and Node.js updated
   - Update dependencies regularly
   - Monitor for security patches

## Known Security Considerations

### Current Implementation

1. **Database Credentials**: Stored in `.env` file - ensure proper file permissions (600)
2. **CORS**: Currently allows all origins in development - restrict in production
3. **File Uploads**: Limited to 10MB, validates extensions - consider additional scanning
4. **API Rate Limiting**: Not implemented - recommended for production
5. **HTTPS**: Not enforced - required for production deployment

### Recommended for Production

```python
# backend/app.py - Add rate limiting
from flask_limiter import Limiter
limiter = Limiter(app, key_func=get_remote_address)

@app.route('/identify', methods=['POST'])
@limiter.limit("10 per minute")
def identify_shabad():
    # ...
```

```python
# backend/app.py - Restrict CORS
CORS(app, origins=["https://yourdomain.com"])
```

## Security Checklist for Production Deployment

- [ ] Change all default passwords
- [ ] Set strong MySQL root password
- [ ] Configure CORS to allow only your domain
- [ ] Enable HTTPS/SSL
- [ ] Set `FLASK_DEBUG=False`
- [ ] Use a production WSGI server (Gunicorn/uWSGI)
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Regular backups of database
- [ ] Keep dependencies updated
- [ ] Review and restrict file upload locations
- [ ] Set proper file permissions on `.env` (600)

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible
5. Publish a security advisory

## Comments

If you have suggestions for improving this security policy, please submit a pull request or open an issue.

---

**Last Updated:** 2025-01-23
