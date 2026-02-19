import './globals.css';

export const metadata = {
  title: 'Biashara Control MVP',
  description: 'Simple financial control for Kenyan small businesses'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
