import './globals.css';
export const metadata = { title: "bedlly. — Find a PG that doesn't suck", description: 'Personally visited PGs near SD College, Chandigarh' };
export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Geom:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Libre+Caslon+Text:ital,wght@1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
