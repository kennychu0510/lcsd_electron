import { ElectronAPI } from "src/preload";

declare global {
  interface Window {
    ElectronAPI: typeof ElectronAPI;
  }
}
