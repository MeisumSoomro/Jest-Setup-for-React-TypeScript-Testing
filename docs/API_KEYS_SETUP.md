# API Keys Setup Guide for EduFlow

## 1. Clerk Authentication (https://clerk.dev)
### Steps:
1. Create account at clerk.dev
2. Create new application
3. Go to API Keys section
4. Copy these keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_************
   CLERK_SECRET_KEY=sk_test_************
   ```

## 2. Stripe Payment (https://stripe.com)
### Steps:
1. Create Stripe account
2. Go to Developers → API keys
3. Get these keys:
   ```
   STRIPE_API_KEY=sk_test_************
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_************
   ```
4. Set up webhook:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Get webhook secret:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_************
   ```

## 3. Uploadthing (https://uploadthing.com)
### Steps:
1. Create account at uploadthing.com
2. Create new project
3. Get these keys from dashboard:
   ```
   UPLOADTHING_SECRET=sk_live_************
   UPLOADTHING_APP_ID=************
   ```

## 4. Database (Supabase/PostgreSQL)
### Steps:
1. Create account at supabase.com
2. Create new project
3. Go to Project Settings → Database
4. Get connection string:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

## Where to Insert API Keys

### 1. Local Development
1. Create `.env.local` file in root directory
2. Copy all variables from `.env.example`
3. Paste your API keys

### 2. Vercel Deployment
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each key-value pair

### 3. GitHub Actions
1. Go to repository settings
2. Select Secrets and Variables → Actions
3. Add these secrets:
   ```
   VERCEL_TOKEN
   VERCEL_ORG_ID
   VERCEL_PROJECT_ID
   ```

## Environment Variables Template
```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# File Upload
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Payment
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Security Best Practices

1. **Never commit API keys to Git**
   - Keep `.env` files in `.gitignore`
   - Use environment variables for deployment

2. **Key Rotation**
   - Regularly rotate sensitive keys
   - Update deployment environments accordingly

3. **Access Restrictions**
   - Limit API key permissions
   - Use test keys for development
   - Use production keys only in production

4. **Monitoring**
   - Monitor API usage
   - Set up usage alerts
   - Check for unauthorized access

## Troubleshooting

### Common Issues:
1. **Invalid API Keys**
   - Verify key format
   - Check environment
   - Ensure keys are properly set

2. **Missing Environment Variables**
   - Compare with `.env.example`
   - Check deployment settings
   - Verify variable names

3. **Webhook Errors**
   - Verify webhook URL
   - Check webhook secret
   - Monitor webhook logs

## Regular Maintenance

1. **Monthly Tasks**
   - Check API key validity
   - Monitor usage limits
   - Review security logs

2. **Quarterly Tasks**
   - Rotate API keys
   - Update documentation
   - Review access permissions

Remember to never share or expose your API keys publicly. Always use environment variables and secure storage methods for production deployments. 