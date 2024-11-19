import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function RazorPay({ courseDetails, onClose, onSuccess }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (window.Razorpay) {
      const options = {
        key: "rzp_test_l8piXtKo4rqjfC", 
        amount: courseDetails.price * 100, 
        currency: "INR",
        name: "Skillfinity",
        description: `Purchase of ${courseDetails.coursetitle}`,
        image: "https://res.cloudinary.com/dwxnxuuht/image/upload/v1731729450/jg71lnyx6dfyy1b9mq2o.svg",
        handler: function (response) {
          console.log("Payment successful", response);
          toast.success("Payment successful!");
          onSuccess();
          onClose();
        },
        prefill: {
          name: "Mohammed Jisam",
          email: "mohammedjisamtp@gmail.com",
          contact: "9037250023",
        },
        notes: {
          address: "Skillfinity. Endless Skills, Infinite Growth",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error("Payment failed", response.error);
        toast.error("Payment failed. Please try again.");
      });
      razorpay.open();
    } else {
      toast.error("Razorpay is not loaded. Please try again later.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white bg-opacity-90 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">Complete Your Purchase</DialogTitle>
          <DialogDescription className="text-gray-600">
            You are about to purchase <span className="font-semibold">{courseDetails.coursetitle}</span> for <span className="font-semibold text-green-600">₹{courseDetails.price}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-gray-700">Click the button below to proceed with the payment using Razorpay.</p>
        </div>
        <DialogFooter>
          <Button onClick={handlePayment} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
            Pay ₹{courseDetails.price} with Razorpay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RazorPay;