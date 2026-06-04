"use client";

export default function VoiceView() {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight">Voice & language</h2>
        <p className="text-xs text-muted">Español · Português · English</p>
      </div>

      <div className="rounded-xl border border-dashed border-line bg-card p-5 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-2xl">
          🎙️
        </div>
        <p className="text-sm font-semibold">Ask in your language</p>
        <p className="mx-auto mt-1 max-w-[16rem] text-xs leading-relaxed text-muted">
          &ldquo;Soy hincha de Brasil, me quedo en Brickell&rdquo; → your plan,
          read back in Spanish or Portuguese.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-card-2 p-3">
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">The honest rule:</span> voice
          only does speech-to-text + translation. It fills the{" "}
          <span className="font-medium text-ink">same computed plan</span> — it
          never invents a departure time. The model can&apos;t hallucinate a
          wrong &ldquo;leave by.&rdquo;
        </p>
      </div>
    </section>
  );
}
