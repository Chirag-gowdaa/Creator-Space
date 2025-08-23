"use client";
import React, { useRef, useState, useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { User, Info, Users, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createOrder } from "../actions/payment";
import Image from "next/image";
import Link from "next/link";

const PaymentPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [paymentform, setpaymentform] = useState({
    amount: "",
    name: "",
    message: "",
    profilePic: "",
    coverPic: "/default.jpg",
  });

  const [active, setActive] = useState("profile");

  const profileRef = useRef(null);
  const infoRef = useRef(null);
  const supportersRef = useRef(null);
  const scrollableRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setpaymentform((prev) => ({
            ...prev,
            profilePic:
              data.profilePic || session?.user?.image || "/default-profile.png",
            coverPic: data.coverPic || "/default.jpg",
          }));
        } else {
          setpaymentform((prev) => ({
            ...prev,
            profilePic: session?.user?.image || "/default-profile.png",
            coverPic: "/default.jpg",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setpaymentform((prev) => ({
          ...prev,
          profilePic: session?.user?.image || "/default-profile.png",
          coverPic: "/default.jpg",
        }));
      }
    };

    if (session) fetchProfile();
  }, [session]);

  // Scroll tracking for active section highlight
  useEffect(() => {
    const container = scrollableRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = [
        { ref: profileRef, id: "profile" },
        { ref: infoRef, id: "information" },
        { ref: supportersRef, id: "supporters" },
      ];

      for (const section of sections) {
        const rect = section.ref.current?.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (
          rect &&
          rect.top <= containerRect.top + containerRect.height / 2 &&
          rect.bottom >= containerRect.top + containerRect.height / 2
        ) {
          setActive(section.id);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }

  // Razorpay integration
  const pay = async (amount) => {
    try {
      const order = await createOrder(
        amount,
        session.user.name,
        paymentform.name,
        paymentform.name,
        paymentform.message
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "CreatorSpace",
        description: "Support Creator",
        image: "/logo.png",
        order_id: order.id,
        handler: function (response) {
          alert("Payment Successful!");
          console.log(response);
        },
        theme: { color: "#000000" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-50 p-3 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Sidebar (Desktop) */}
        {/* <div className="hidden md:flex w-20 bg-zinc-900 flex-col items-center py-8 space-y-8 fixed top-0 left-0 h-full border-r border-white/10">
          <button className="p-4 rounded-full hover:bg-zinc-800 transition">
            <User className="w-6 h-6" />
          </button>
          <button className="p-4 rounded-full hover:bg-zinc-800 transition">
            <Info className="w-6 h-6" />
          </button>
          <button className="p-4 rounded-full hover:bg-zinc-800 transition">
            <Users className="w-6 h-6" />
          </button>
        </div> */}

        {/* Main Content */}
        <div
          id="scrollable-content"
          ref={scrollableRef}
          className="md:ml-20 flex-1 overflow-y-scroll scroll-smooth p-6 md:p-12 space-y-16"
        >
          {/* Profile Section */}
          <section
            ref={profileRef}
            className="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden"
          >
            <Image
              src={paymentform.coverPic}
              width={1200}
              height={400}
              className="w-full h-40 md:h-56 object-cover"
              alt="Cover"
            />
            <div className="flex flex-col md:flex-row items-center gap-4 p-6 -mt-10 relative z-10">
              <Image
                src={paymentform.profilePic}
                alt="Profile"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full border-4 border-zinc-900"
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{session.user.name}</h1>
                <p className="text-gray-400">{session.user.email}</p>
              </div>
            </div>
          </section>

          {/* Supporters Section */}
          <section
            ref={supportersRef}
            className="bg-zinc-900 p-6 rounded-2xl border border-white/5"
          >
            <h1 className="text-xl font-bold tracking-widest text-gray-200 pb-6">
              Supporters
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Form */}
              <div className="bg-zinc-800 p-6 rounded-xl border border-white/5 space-y-4">
                <h2 className="text-lg font-semibold">Make a Payment</h2>
                <input
                  onChange={handleChange}
                  value={paymentform.amount}
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-white/10 text-white"
                />
                <input
                  onChange={handleChange}
                  value={paymentform.name}
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-white/10 text-white"
                />
                <textarea
                  onChange={handleChange}
                  value={paymentform.message}
                  name="message"
                  placeholder="Add a message (optional)"
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-white/10 text-white"
                />
                <div className="flex flex-wrap gap-3">
                  {[50, 100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => pay(amt)}
                      className="px-4 py-2 bg-black hover:bg-zinc-700 rounded-lg text-white text-sm font-medium transition"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => pay(paymentform.amount)}
                  className="w-full mt-4 py-3 rounded-lg font-semibold bg-gradient-to-br from-zinc-800 via-black to-zinc-900 hover:from-zinc-700 hover:via-zinc-800 hover:to-zinc-900 border border-white/10 shadow-md shadow-black/40"
                >
                  Pay Now
                </button>
              </div>

              {/* Messages */}
              <div className="bg-zinc-800 p-6 rounded-xl border border-white/5 space-y-4">
                <h2 className="text-lg font-semibold">Messages From Supporters</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900 rounded-lg">
                    <p className="text-gray-300">{paymentform.message}</p>
                    <span className="text-sm text-gray-500">
                      - {paymentform.name || "Anonymous"}
                    </span>
                  </div>
                  <div className="p-4 bg-zinc-900 rounded-lg">
                    <p className="text-gray-300">"Your content is amazing!"</p>
                    <span className="text-sm text-gray-500">- Jane Smith</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
