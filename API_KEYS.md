# API Keys Setup Guide

This document explains where to obtain and configure all required API keys for the LMS platform.

## Authentication (Clerk)
- Go to https://clerk.dev/
- Create a new application
- Get your API keys from the dashboard:
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Storage (Uploadthing)
- Visit https://uploadthing.com/
- Create an account and project
- Copy your keys:
  - `UPLOADTHING_SECRET`
  - `UPLOADTHING_APP_ID`

## Payment Processing (Stripe)
- Go to https://dashboard.stripe.com/
- Register/Login to your account
- Get your API keys:
  - `STRIPE_API_KEY` (Secret key)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Set up webhooks and get:
  - `STRIPE_WEBHOOK_SECRET`

## Google Integration
- Visit https://console.cloud.google.com/
- Create a new project
- Enable Calendar and Drive APIs
- Create OAuth 2.0 credentials:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

## Microsoft Teams
- Go to https://portal.azure.com/
- Register your application
- Get your credentials:
  - `MS_TEAMS_CLIENT_ID`
  - `MS_TEAMS_CLIENT_SECRET`

## Zoom
- Visit https://marketplace.zoom.us/
- Create a new app
- Get your credentials:
  - `ZOOM_CLIENT_ID`
  - `ZOOM_CLIENT_SECRET`

## Email (SMTP)
- Choose an email provider (e.g., SendGrid, Amazon SES)
- Get SMTP credentials:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`

## Database
- Set up a PostgreSQL database (e.g., on Railway, Supabase, or similar)
- Get your connection string:
  - `DATABASE_URL` 