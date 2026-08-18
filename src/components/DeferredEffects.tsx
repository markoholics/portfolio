"use client";

import dynamic from "next/dynamic";

const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), {
  ssr: false,
});
const RotatePrompt = dynamic(() => import("@/components/RotatePrompt"), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export default function DeferredEffects() {
  return (
    <>
      <ScrollProgress />
      <RotatePrompt />
      <CustomCursor />
    </>
  );
}
