import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useOrder } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MapPin, CreditCard, CheckCircle, Package } from "lucide-react";

const CheckoutPage = () => {
  const { pendingProduct, placeOrder } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (!pendingProduct) return <Navigate to="/" replace />;

  const total = pendingProduct.price * pendingProduct.selected_quantity;
  const totalINR = (total * 83).toFixed(0);

  const handleConfirm = () => {
    if (!address.trim()) return;
    setSubmitting(true);
    const paymentLabels: Record<string, string> = { cod: "Cash on Delivery", upi: "UPI", card: "Card" };
    placeOrder({
      user_id: user.id,
      product_id: pendingProduct.product_id,
      product_name: pendingProduct.product_name,
      quantity: pendingProduct.selected_quantity,
      total_amount: total,
      payment_method: paymentLabels[paymentMethod],
      payment_status: paymentMethod === "cod" ? "Pending" : "Paid",
      product_image: pendingProduct.product_image,
      address,
    });
    navigate("/order-success", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <CartDrawer />
      <main className="flex-1 section-max-width px-5 py-8">
        <h1 className="text-2xl font-extrabold text-foreground mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-surface rounded-2xl p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" /> Order Summary
              </h2>
              <div className="flex gap-4">
                <img
                  src={pendingProduct.product_image}
                  alt={pendingProduct.product_name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{pendingProduct.product_name}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                    {pendingProduct.selected_size && <span>Size: {pendingProduct.selected_size}</span>}
                    {pendingProduct.selected_color && <span>Color: {pendingProduct.selected_color}</span>}
                    <span>Qty: {pendingProduct.selected_quantity}</span>
                  </div>
                  <p className="text-primary font-extrabold mt-2">
                    ₹{totalINR} <span className="text-xs font-normal text-muted-foreground">(${total.toFixed(2)})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-surface rounded-2xl p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Delivery Address
              </h2>
              <Input
                placeholder="Enter your full delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="mb-2"
              />
            </div>

            {/* Payment */}
            <div className="glass-surface rounded-2xl p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Method
              </h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {[
                  { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive" },
                  { value: "upi", label: "UPI", desc: "Google Pay, PhonePe, etc." },
                  { value: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                ].map(opt => (
                  <Label
                    key={opt.value}
                    htmlFor={opt.value}
                    className={`flex items-center gap-3 rounded-xl p-4 cursor-pointer border transition-colors ${
                      paymentMethod === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <div>
                      <span className="font-bold text-foreground text-sm">{opt.label}</span>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Sidebar total */}
          <div className="lg:col-span-1">
            <div className="glass-surface rounded-2xl p-5 sticky top-24 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Price ({pendingProduct.selected_quantity} item{pendingProduct.selected_quantity > 1 ? "s" : ""})</span>
                  <span>₹{totalINR}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-primary font-bold">Free</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-extrabold text-foreground text-base">
                  <span>Total</span>
                  <span>₹{totalINR}</span>
                </div>
              </div>
              <Button
                onClick={handleConfirm}
                disabled={!address.trim() || submitting}
                className="w-full gradient-cta font-extrabold text-sm h-12"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CheckoutPage;
