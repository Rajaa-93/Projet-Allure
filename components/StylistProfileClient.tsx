"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, Palette, Users, X } from "lucide-react";
import type { StylistProfile } from "@/lib/stylists";

export default function StylistProfileClient({
  stylist,
}: {
  stylist: StylistProfile;
}) {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const activePost = stylist.posts.find((post) => post.id === activePostId) ?? null;

  return (
    <main className="px-4 pb-16 pt-6">
      <div className="sticky top-0 z-20 -mx-4 mb-4 bg-[#f6f1e7]/96 px-4 pb-3 pt-3 backdrop-blur">
        <Link
          href="/styliste#stylistes-list"
          className="inline-flex items-center rounded-full border border-[#d8cab2] bg-[#fffaf2] px-4 py-2 text-sm font-semibold text-[#8f7244]"
        >
          <ChevronLeft size={16} className="mr-1" />
          Retour aux stylistes
        </Link>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
        <Image
          src={stylist.heroImage}
          alt={stylist.name}
          width={1200}
          height={900}
          className="h-56 w-full object-cover"
        />

        <div className="p-5">
          <div className="-mt-8 mb-4 flex items-start gap-4">
            <Image
              src={stylist.avatar}
              alt={stylist.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-[24px] border-4 border-[#fbf8f1] object-cover shadow-[0_10px_20px_rgba(55,43,28,0.12)]"
            />
            <div className="pt-8">
              <p className="text-[1.02rem] font-semibold text-[#1d1813]">
                {stylist.name}
              </p>
              <p className="text-sm text-[#6f6250]">{stylist.title}</p>
            </div>
          </div>

          <p className="text-sm leading-6 text-[#4e4030]">{stylist.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {stylist.styleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#efe5cf] px-3 py-2 text-xs font-semibold text-[#8f7244]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[20px] bg-[#fffaf2] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#8f7244]">
                <Users size={16} />
                <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                  Relookes
                </p>
              </div>
              <p className="text-sm text-[#1d1813]">
                {stylist.relikedPeople.join(", ")}
              </p>
            </div>
            <div className="rounded-[20px] bg-[#fffaf2] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#8f7244]">
                <Palette size={16} />
                <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                  Style
                </p>
              </div>
              <p className="text-sm text-[#1d1813]">
                {stylist.styleTags.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[1rem] font-semibold text-[#1d1813]">
            Posts du styliste
          </h2>
          <span className="inline-flex items-center text-xs font-semibold text-[#8f7244]">
            <Heart size={14} className="mr-1" />
            Feed looks
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stylist.posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setActivePostId(post.id)}
              className="overflow-hidden rounded-[18px] border border-[#d7cab2] bg-[#fbf8f1] shadow-[0_8px_18px_rgba(55,43,28,0.08)]"
            >
              <Image
                src={post.image}
                alt={`${stylist.name} post`}
                width={500}
                height={500}
                className="aspect-square h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {activePost ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,8,6,0.78)] px-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={() => setActivePostId(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1d1813]"
            >
              <X size={18} />
            </button>
            <Image
              src={activePost.image}
              alt={`${stylist.name} look`}
              width={1200}
              height={1200}
              className="max-h-[75vh] w-full object-cover"
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
