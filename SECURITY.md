# CeloSoul Dating AI Agent - Security Guidelines

## 🔒 Security Checklist

### ✅ Files Protected by .gitignore:
- `.env` files (API keys, secrets)
- Database files (*.db, *.sqlite)
- Log files (*.log)
- Cache directories
- User uploads and photos
- Conversation data
- Model files
- Temporary files
- IDE configuration files
- OS generated files

### 🚨 Sensitive Data Never Commit:
- OpenAI API keys
- Database passwords
- User personal data
- Conversation logs
- Payment information
- Wallet private keys

### 🔑 Environment Variables:
All sensitive configuration should be in `.env` files:
```
OPENAI_API_KEY=your_key_here
DATABASE_URL=your_db_url
SECRET_KEY=your_secret
```

### 📋 Pre-deployment Security:
1. ✅ Remove any hardcoded API keys
2. ✅ Use environment variables for all secrets
3. ✅ Enable HTTPS in production
4. ✅ Set up proper CORS policies
5. ✅ Implement rate limiting
6. ✅ Add input validation
7. ✅ Use secure headers
8. ✅ Enable logging and monitoring

### 🛡️ Production Security:
- Use strong, unique API keys
- Rotate keys regularly
- Monitor API usage
- Set up alerts for unusual activity
- Use environment-specific configurations
- Enable audit logging
- Implement proper authentication

### 📞 Security Contact:
If you discover a security vulnerability, please report it responsibly.

### 🔄 Regular Security Tasks:
- [ ] Review and rotate API keys monthly
- [ ] Update dependencies regularly
- [ ] Monitor for security advisories
- [ ] Review access logs
- [ ] Test backup and recovery procedures
