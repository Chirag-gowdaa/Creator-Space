"use client";

import React from "react";
import Script from "next/script";
import PaymentPage from "../components/PaymentPage";

const Page = () => {
  return (
    <div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <PaymentPage />
    </div>
  );
};

export default Page;
