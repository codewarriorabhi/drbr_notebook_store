import React, { createContext, useContext, useState, useCallback } from "react";

export interface OrderProduct {
  product_id: string;
  product_name: string;
  price: number;
  selected_quantity: number;
  selected_color?: string;
  selected_size?: string;
  product_image: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  order_date: string;
  product_image: string;
  address: string;
}

interface OrderContextType {
  pendingProduct: OrderProduct | null;
  setPendingProduct: (p: OrderProduct | null) => void;
  orders: Order[];
  lastOrder: Order | null;
  placeOrder: (order: Omit<Order, "order_id" | "order_date" | "order_status">) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingProduct, setPendingProduct] = useState<OrderProduct | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const placeOrder = useCallback((data: Omit<Order, "order_id" | "order_date" | "order_status">) => {
    const order: Order = {
      ...data,
      order_id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      order_date: new Date().toISOString(),
      order_status: "Pending",
    };
    setOrders(prev => [...prev, order]);
    setLastOrder(order);
    setPendingProduct(null);
    return order;
  }, []);

  return (
    <OrderContext.Provider value={{ pendingProduct, setPendingProduct, orders, lastOrder, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};
