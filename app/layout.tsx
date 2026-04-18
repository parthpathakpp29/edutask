import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "EduTask - House of Edtech Assignment",
    template: "%s | EduTask",
  },
  description:
    "EduTask is a full-stack assignment management platform built for the House of Edtech Fullstack Developer Assignment.",
  applicationName: "EduTask",
  keywords: [
    "Next.js 16",
    "Prisma",
    "PostgreSQL",
    "Assignment Management",
    "House of Edtech",
  ],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}

      </body>
    </html>
  )
}
