export interface TelegramUser {
    id: number;
    first_name?: string;
    username?: string;
  }
  
  export interface TelegramWebApp {
    initDataUnsafe: {
      user?: TelegramUser;
      chat?: {
        id: number;
        type: string;
      };
    };
    sendData: (data: string) => void;
    openTelegramLink?: (url: string) => void;
  }
  
  export type Coin = {
    id: number;
    rotation: number;
    angle: number;
  };
  
  // Добавьте это для проверки работы алиасов
  export const typesTest = "TEST_SUCCESS" as const;
  
  declare global {
    interface Window {
      Telegram?: {
        WebApp: TelegramWebApp;
      };
    }
  }