This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## PostgreSQL Database Password Encryption

This application is made using the PostgreSQL database. To create a more secure login for our users, we used PostgreSQL's feature of roles/users. When the user registers an account for the site, the password is encrypted using MD5. For us to test and run the application, we need to change the password encryption method of the PostgreSQL database to MD5, as it defaults the SCRAM-SHA-256.

To change it on a MAC device:

- Open SQL Shell (Don't Close Shell Until Procedure is Complete and Functional)
- Type: SET password_encryption = 'md5';
- Reset Your postgres superuser's password (Now, Your Password for postgres Should Be Encrypted Using MD5)
- Open Terminal, Go to the Directory /Library/PostgreSQL/16/data (Again, Don't Close Terminal)
- Type sudo -su postgres, Then Type in Your MAC Login
- Edit the File pg_hba.conf (Preferably with VIM) by Changing All Instances of scram-sha-256 to md5, Save w/ :wq (if Using VIM)
- Edit the File postgresql.conf (Must Be VIM) by Changing scram-sha-256 on the Line '#password_encryption...' to md5 (Also Remove # in Front of password_encryption), Save w/ :wq!
  - As postgresql.conf isn't Supposed to Be Modified, It'll Most Like Tell You that You Can't Edit the File, and Exit the File, So Continue Trying (Should Take Only a Few Tries) Until Asked If You're Sure You Want to Edit the File, Type y for 'Yes.'
- Open Back Up the SQL Shell You Initially Opened, and Type SELECT pg_reload_conf();
- Open Up a New SQL Shell, and Login As You Normally Would
  - If Successful the 1st Time, Everything is Good to Go!; You Can Move onto Setting Up the Next.js Application
  - If Not, Make Sure the Files are Edited Correctly and Repeat the Steps From There

To change it on a Windows device (using PowerShell), the steps are the same, but you don't need to type sudo -su postgres, as sudo isn't a command on Windows. Also, editing tools like nano or vim don't work on Windows. Instead use notepad.exe <file_name> to edit the changes mentioned above.