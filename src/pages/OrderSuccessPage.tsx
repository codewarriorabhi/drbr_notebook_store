import { Navigate, Link } from "react-router-dom";
import { useOrder } from "@/context/OrderContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccessPage = () => {
  const { lastOrder } = useOrder();

  if (!lastOrder) return <Navigate to="/" replace />;

  const estimatedDate = new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Order Placed!</h1>
            <p className="text-muted-foreground mt-1">Thank you for your purchase</p>
          </div>

          <div className="glass-surface rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center gap-3">
              <img src={lastOrder.product_image} alt="" className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-foreground text-sm">{lastOrder.product_name}</p>
                <p className="text-xs text-muted-foreground">Qty: {lastOrder.quantity}</p>
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-bold text-foreground">{lastOrder.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-bold text-foreground">{lastOrder.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-bold text-primary">{lastOrder.order_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-extrabold text-foreground">₹{(lastOrder.total_amount * 83).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="glass-surface rounded-xl p-4 flex items-center gap-3 text-left">
            <Package className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Delivery</p>
              <p className="text-sm font-bold text-foreground">{estimatedDate}</p>
            </div>
          </div>

          <Link to="/">
            <Button className="gradient-cta font-extrabold text-sm h-11 px-8 mt-2">
              Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default OrderSuccessPage;
