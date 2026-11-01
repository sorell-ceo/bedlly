1. Supabase: SQL Editor -> run supabase.sql. Auth -> Sign In / Providers -> turn OFF "Allow new users to sign up", then add your own user (Auth -> Users -> Add user).
2. cp .env.local.example .env.local and fill the 3 values.
3. npm install && npm run dev  ->  site at /, admin at /admin
4. Deploy on Vercel (add the same 3 env vars).
