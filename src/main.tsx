import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import { createRoot } from "react-dom/client";
import { AppWrapper } from "./AppWrapper.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";

const initializeAndRender = async () => {
  if (Capacitor.getPlatform() === 'web') {
    console.log("Initializing SQLite web store...");
    window.customElements.define('jeep-sqlite', JeepSqlite);
    try {
      await CapacitorSQLite.initWebStore(); // Await here
      console.log("SQLite web store initialized successfully.");
    } catch (err) {
      console.error("Error initializing SQLite web store", err);
      // Podrías mostrar un mensaje de error al usuario aquí si la inicialización falla.
    }
  }

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
};

initializeAndRender();
