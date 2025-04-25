'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TonConnectUIProvider, useTonConnectUI, useTonWallet, THEME } from '@tonconnect/ui-react';

// Общие типы и интерфейсы
interface TelegramUser {
  id: number;
  first_name?: string;
  username?: string;
}

interface TelegramWebApp {
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

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

type Coin = {
  id: number;
  rotation: number;
  angle: number;
};

// Компонент анимированного пузыря
const AnimatedBubble = ({ isDark }: { isDark: boolean }) => {
  const size = 20 + Math.random() * 35;
  const speed = 0.8 + Math.random() * 1.5;
  const startX = Math.random() * 100;
  const startDelay = -Math.random() * 15;

  return (
    <motion.div
      className="absolute rounded-full opacity-50"
      style={{
        width: size,
        height: size,
        left: `${startX}vw`,
        top: `-${size * 2}px`,
        backgroundColor: isDark ? `rgba(16, 185, 129, 0.18)` : `rgba(59, 130, 246, 0.18)`,
        willChange: 'transform',
      }}
      animate={{
        y: ["-20vh", "100vh"],
        scale: [1, 1.08, 1],
        rotate: [0, 720],
      }}
      transition={{
        duration: 18 / speed,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: startDelay,
      }}
    />
  );
};

// Основной компонент формы
function RegistrationFormContent() {
  const [isDark, setIsDark] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [telegramId, setTelegramId] = useState<string>("");
  const [socialLink, setSocialLink] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const reducedMotion = useReducedMotion();

  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [tonAddress, setTonAddress] = useState<string>("");

  // Автоматически получаем Telegram ID и username
  useEffect(() => {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (user?.id) {
      setTelegramId(user.id.toString());
      if (user.username) {
        setSocialLink(`https://t.me/${user.username}`);
      }
    }
  }, []);

  // Обновляем адрес кошелька
  useEffect(() => {
    if (wallet) {
      setTonAddress(wallet.account.address);
    }
  }, [wallet]);

  const handleParticipateClick = () => {
    if (!reducedMotion) {
      setCoins(Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        rotation: Math.random() * 720,
        angle: Math.random() * Math.PI * 2,
      })));

      setTimeout(() => {
        setShowForm(true);
        setCoins([]);
      }, 700);
    } else {
      setShowForm(true);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await tonConnectUI.connectWallet();
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь вы можете обработать данные формы (telegramId, socialLink, email, tonAddress)
    console.log("Данные для отправки:", { telegramId, socialLink, email, tonAddress });
    // После обработки можно сбросить форму или показать сообщение об успехе
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${isDark ? "bg-gray-900" : "bg-blue-50"}`}>
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 p-3 bg-white rounded-lg shadow-md z-50"
      >
        {isDark ? "🌙" : "🌞"}
      </button>

      {!showForm && !reducedMotion &&
        Array.from({ length: 8 }).map((_, i) => (
          <AnimatedBubble key={`bubble-${i}`} isDark={isDark} />
        ))}

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <AnimatePresence>
          {!showForm ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.button
                ref={buttonRef}
                onClick={handleParticipateClick}
                initial={false}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [1, 0.9, 1],
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  scale: 1.2,
                  boxShadow: isDark
                    ? "0 12px 48px rgba(16, 185, 129, 0.7)"
                    : "0 12px 48px rgba(59, 130, 246, 0.7)",
                }}
                className={`
                  w-52 h-52 md:w-64 md:h-64 rounded-full
                  flex items-center justify-center
                  text-white font-bold text-2xl md:text-3xl
                  ${isDark
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
                    : "bg-gradient-to-br from-blue-500 to-blue-700"
                  }
                  shadow-lg mb-8
                  will-change: transform, opacity;
                `}
              >
                Участвовать
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: "8%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`w-full max-w-md p-6 rounded-lg shadow-lg z-50 ${isDark ? "bg-gray-800" : "bg-white"}`}
              style={{ maxWidth: '90%', margin: '0 auto', willChange: 'opacity, transform' }}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"} text-center`}>
                Регистрация
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Telegram ID
                  </label>
                  <input
                    type="text"
                    value={telegramId}
                    readOnly
                    className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    TON Адрес
                  </label>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <input
                      type="text"
                      value={tonAddress}
                      readOnly
                      className={`flex-1 p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    />
                    <button
                      type="button" // Изменил на button, чтобы не сабмитить форму при подключении кошелька
                      onClick={handleConnectWallet}
                      className={`px-4 py-2 rounded ${isDark ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                      style={{ flexShrink: 0 }}
                    >
                      {tonAddress ? "Изменить" : "Подключить"}
                    </button>
                  </div>
                </div> 

                <div>
                  <label className={`block mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Email (необязательно)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2 rounded border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-bold ${isDark ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"} text-white mt-4`}
                >
                  Зарегистрироваться
                </button>
              </form>
            </motion.div>
          )}

          <AnimatePresence>
            {!reducedMotion && coins.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-20"
                />

                {coins.map((coin) => {
                  const buttonRect = buttonRef.current?.getBoundingClientRect();
                  const centerX = buttonRect ? buttonRect.left + buttonRect.width / 2 : 0;
                  const centerY = buttonRect ? buttonRect.top + buttonRect.height / 2 : 0;

                  const distance = 120 + Math.random() * 80;
                  const finalX = centerX + Math.cos(coin.angle) * distance;
                  const finalY = centerY + Math.sin(coin.angle) * distance;

                  return (
                    <motion.div
                      key={coin.id}
                      initial={{
                        x: centerX,
                        y: centerY,
                        opacity: 0.9,
                        scale: 0.4,
                        rotate: 0,
                      }}
                      animate={{
                        x: finalX,
                        y: finalY,
                        opacity: 0,
                        scale: 1.4,
                        rotate: coin.rotation * 4,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="absolute w-7 h-7 z-30 origin-center"
                      style={{ left: 0, top: 0, willChange: 'transform, opacity, scale, rotate' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="8" fill="#FFD700" />
                        <circle cx="12" cy="12" r="6" fill="#FFEB3B" />
                      </svg>
                    </motion.div>
                  );
                })}
              </>
            )}
          </AnimatePresence>

          {showForm && (
            <div className={`fixed inset-0 z-20 ${
              isDark
                ? "bg-gradient-to-t from-transparent to-gray-900/60"
                : "bg-gradient-to-t from-transparent to-blue-50/60"
            }`} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Главный компонент-обертка
export default function RegistrationForm() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://your-website.com/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
    >
      <RegistrationFormContent />
    </TonConnectUIProvider>
  );
}