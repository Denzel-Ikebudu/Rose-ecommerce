"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, MessageSquarePlus } from "lucide-react";
import { FADE_UP, STAGGER_CONTAINER } from "@/constants/motion";
import Navbar from "@/components/shared/Navbar";
import LeafRating from "@/components/shared/LeafRating";

const INITIAL_REVIEWS = [
  {
    name: "Adaeze O.",
    product: "Turmeric & Ginger Blend",
    rating: 5,
    verified: true,
    date: "2026-05-14",
    body:
      "This has become part of my morning routine. Clean, earthy taste and I genuinely feel steadier through the day. Packaging is neat too.",
  },
  {
    name: "Tunde A.",
    product: "Whole Cloves",
    rating: 5,
    verified: true,
    date: "2026-04-29",
    body:
      "Fresher and more aromatic than what I usually get at the market. A little goes a long way in stews.",
  },
  {
    name: "Ifeoma B.",
    product: "Immune Wellness Tea",
    rating: 4,
    verified: true,
    date: "2026-04-02",
    body:
      "Good quality and arrived well packed. Would love a slightly bigger pack size next time, but no complaints about the product itself.",
  },
  {
    name: "Chidi N.",
    product: "Organic Dried Dates",
    rating: 5,
    verified: false,
    date: "2026-03-21",
    body:
      "Soft, naturally sweet, and no added sugar taste. My kids finished the pack faster than I could hide it.",
  },
  {
    name: "Ngozi E.",
    product: "Curry Blend",
    rating: 4,
    verified: true,
    date: "2026-02-27",
    body:
      "Solid everyday curry blend. Balanced heat, not overpowering. Customer support was also quick to respond when I had a delivery question.",
  },
  {
    name: "Emeka F.",
    product: "Raw Honey",
    rating: 5,
    verified: true,
    date: "2026-02-09",
    body:
      "You can tell this is the real thing. Thick, slightly crystallized in the cooler weeks, exactly how raw honey should behave.",
  },
  {
    name: "Fatima K.",
    product: "Digestive Wellness Tea",
    rating: 3,
    verified: true,
    date: "2026-01-18",
    body:
      "It's decent, but I didn't notice a big difference compared to the loose-leaf version I used to make myself. Taste is good though.",
  },
  {
    name: "Bayo S.",
    product: "Black Pepper",
    rating: 2,
    verified: false,
    date: "2026-01-05",
    body:
      "Flavor was fine but mine arrived with the seal already loose, so I'm not sure how fresh it was by the time it got to me.",
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [filter, setFilter] = useState(0); // 0 = all
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", product: "", rating: 0, body: "" });
  const [status, setStatus] = useState("idle");

  const summary = useMemo(() => {
    const total = reviews.length;
    const avg = total
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : "0.0";
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
    return { total, avg, distribution };
  }, [reviews]);

  const visibleReviews = filter
    ? reviews.filter((r) => r.rating === filter)
    : reviews;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.product || !form.rating || !form.body) return;
    setStatus("sending");
    try {
      // Swap for a real endpoint, e.g. POST /api/reviews that writes to your database
      await new Promise((resolve) => setTimeout(resolve, 600));
      setReviews([
        {
          ...form,
          verified: false,
          date: new Date().toISOString().slice(0, 10),
        },
        ...reviews,
      ]);
      setForm({ name: "", product: "", rating: 0, body: "" });
      setStatus("sent");
      setShowForm(false);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="bg-herbal-dark text-herbal-cream min-h-screen">
      <Navbar />

      {/* Intro */}
      <section className="px-6 pt-40 pb-16">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.span
            variants={FADE_UP}
            className="font-sans text-xs uppercase tracking-[0.3em] text-herbal-accent"
          >
            Customer Reviews
          </motion.span>
          <motion.h1
            variants={FADE_UP}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-herbal-cream mt-4"
          >
            What our community is saying.
          </motion.h1>
          <motion.p
            variants={FADE_UP}
            className="font-sans text-base text-herbal-cream/60 leading-relaxed mt-5 max-w-lg mx-auto"
          >
            Real experiences from people using our herbal products, natural
            foods, and spices in their everyday lives.
          </motion.p>
        </motion.div>
      </section>

      {/* Rating summary */}
      <section className="px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-10 items-center border border-white/10 rounded-2xl p-10 bg-white/[0.02]"
        >
          <div className="text-center sm:text-left sm:border-r sm:border-white/10 sm:pr-10">
            <p className="font-serif text-6xl text-herbal-cream">{summary.avg}</p>
            <div className="flex justify-center sm:justify-start mt-2 mb-2">
              <LeafRating value={Math.round(Number(summary.avg))} />
            </div>
            <p className="font-sans text-xs text-herbal-cream/45 uppercase tracking-[0.15em]">
              Based on {summary.total} reviews
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            {summary.distribution.map(({ star, count }) => {
              const pct = summary.total ? (count / summary.total) * 100 : 0;
              return (
                <button
                  key={star}
                  onClick={() => setFilter(filter === star ? 0 : star)}
                  className={`flex items-center gap-3 bg-transparent border-none cursor-pointer group ${
                    filter === star ? "opacity-100" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className="w-16 shrink-0">
                    <LeafRating value={star} size="w-3 h-3" />
                  </span>
                  <span className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <span
                      className={`block h-full rounded-full transition-all duration-300 ${
                        filter === star ? "bg-herbal-accent" : "bg-herbal-accent/50"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="font-sans text-xs text-herbal-cream/40 w-6 text-right shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
            {filter !== 0 && (
              <button
                onClick={() => setFilter(0)}
                className="self-start mt-1 font-sans text-xs text-herbal-accent underline underline-offset-4 bg-transparent border-none cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Write a review trigger */}
    

    
      {/* Reviews grid */}
      <section className="px-6 pb-32">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {visibleReviews.length === 0 ? (
            <p className="font-sans text-sm text-herbal-cream/50 col-span-full text-center py-10">
              No reviews at this rating yet.
            </p>
          ) : (
            visibleReviews.map((review, i) => (
              <motion.div
                key={`${review.name}-${review.date}-${i}`}
                variants={FADE_UP}
                className="border border-white/10 rounded-2xl p-7 bg-white/[0.02] flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-base text-herbal-cream">{review.name}</p>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-herbal-accent">
                          <BadgeCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                          <span className="font-sans text-[10px] uppercase tracking-wider">
                            Verified
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-herbal-cream/40 mt-1">
                      {review.product}
                    </p>
                  </div>
                  <LeafRating value={review.rating} size="w-3.5 h-3.5" />
                </div>
                <p className="font-sans text-sm text-herbal-cream/65 leading-relaxed">
                  {review.body}
                </p>
                <p className="font-sans text-[11px] text-herbal-cream/30">
                  {new Date(review.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </section>
    </main>
  );
}