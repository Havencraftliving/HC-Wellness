"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addCartLine,
  parseStoredCart,
  removeCartLine,
  serializeCart,
  setCartQuantity,
  type CartLine,
} from "@/domain/cart/cart";

const STORAGE_KEY = "hc-wellness-cart";

type CartApi = {
  lines: readonly CartLine[];
  ready: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addLine: (line: CartLine) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      setLines(parseStoredCart(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      setLines([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, serializeCart(lines));
    } catch {
      // The cart still works for this visit if storage is blocked.
    }
  }, [lines, ready]);

  const api = useMemo<CartApi>(
    () => ({
      lines,
      ready,
      drawerOpen,
      openDrawer() {
        setDrawerOpen(true);
      },
      closeDrawer() {
        setDrawerOpen(false);
      },
      addLine(line) {
        setLines((current) => addCartLine(current, line));
        setDrawerOpen(true);
      },
      setQuantity(key, quantity) {
        setLines((current) => setCartQuantity(current, key, quantity));
      },
      removeLine(key) {
        setLines((current) => removeCartLine(current, key));
      },
    }),
    [lines, ready, drawerOpen],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }

  return value;
}
