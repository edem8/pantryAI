import { Inter } from "next/font/google";
import "./globals.css";
import { Box, Container } from "@mui/material";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Container
          maxWidth="sm" // Adjust container width based on your preference
          sx={{
            height: "100vh",
            p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
            bgcolor: "whiteSmoke",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 600, // Maximum width for the content
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {children}
          </Box>
          <Toaster richColors position="top-center" />
        </Container>
      </body>
    </html>
  );
}
