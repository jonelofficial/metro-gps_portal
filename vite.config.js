import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT),
  },
  define: {
    "process.env.PORT": `${process.env.PORT}`,
    "process.env.BASEURL": `"${process.env.BASEURL}"`,
  },
});
