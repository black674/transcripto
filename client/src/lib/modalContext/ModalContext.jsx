import { createContext, useContext, useState } from "react";

const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const openSignupModal = () => setSignupOpen(true);
  const closeSignupModal = () => setSignupOpen(false);

  const openLoginModal = () => setLoginOpen(true);
  const closeLoginModal = () => setLoginOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isSignupOpen,
        openSignupModal,
        closeSignupModal,
        isLoginOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
