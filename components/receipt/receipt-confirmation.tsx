"use client";

import { Loader2, Truck } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useReceiptFlow } from "@/hooks/use-receipt-flow";

import { CargoVolumeList } from "./cargo-volume-list";
import { LoadingState } from "./loading-state";
import { ReceiptForm } from "./receipt-form";
import { ShipmentSummaryCard } from "./shipment-summary-card";
import { StatusAlert } from "./status-alert";
import { SuccessState } from "./success-state";

function ReceiptContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    confirmReceipt,
    message,
    nameError,
    observation,
    recipientName,
    romaneioInfo,
    setObservation,
    setRecipientName,
    status,
  } = useReceiptFlow({ token });

  if (status === "loading_info") {
    return <LoadingState />;
  }

  if (status === "success") {
    return <SuccessState message={message} />;
  }

  return (
    <div
      className="relative flex w-full animate-in flex-col slide-in-from-bottom-4 duration-500 md:flex-row"
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div
        className="no-scrollbar w-full flex-shrink-0 overflow-y-auto p-6 sm:p-10 md:w-1/2"
        style={{ maxHeight: "inherit" }}
      >
        <div className="mb-6 mt-2 text-center md:mb-8 md:flex md:items-center md:space-x-5 md:text-left">
          <div className="mb-4 inline-block flex-shrink-0 rotate-3 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-1 shadow-lg transition-transform duration-300 hover:rotate-0 md:mb-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white sm:h-20 sm:w-20 sm:rounded-[22px]">
              <Truck className="h-8 w-8 text-blue-600 sm:h-10 sm:w-10" />
            </div>
          </div>

          <div>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Confirmacao de entrega
            </h1>
            <p className="mx-auto max-w-[340px] text-[14px] leading-relaxed text-slate-500 md:mx-0 md:pr-4 sm:text-[15px]">
              Verifique os detalhes da remessa abaixo antes de assinar
              digitalmente o recebimento.
            </p>
          </div>
        </div>

        {romaneioInfo && <ShipmentSummaryCard romaneioInfo={romaneioInfo} />}

        {status === "error" && <StatusAlert message={message} />}

        {status !== "error" && (
          <ReceiptForm
            isSubmitting={status === "loading_confirm"}
            nameError={nameError}
            observation={observation}
            onConfirm={confirmReceipt}
            onObservationChange={setObservation}
            onRecipientNameChange={setRecipientName}
            recipientName={recipientName}
          />
        )}
      </div>

      {romaneioInfo && <CargoVolumeList romaneioInfo={romaneioInfo} />}
    </div>
  );
}

export function ReceiptConfirmation() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-100 p-4 selection:bg-blue-200 transition-colors duration-500 md:bg-slate-900 md:p-8">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/20 blur-[100px] md:bg-blue-500/10 md:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-400/20 blur-[100px] md:bg-indigo-500/10 md:blur-[120px]" />

      <div className="relative z-10 mb-3 pt-4 text-2xl font-black tracking-tighter text-slate-300 drop-shadow-sm transition-colors duration-500 sm:text-4xl md:mb-5 md:pt-0 md:text-slate-200/20 md:drop-shadow-none">
        FISCAL<span className="text-blue-600 md:text-blue-500/80">TECH</span>
      </div>

      <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/80 shadow-2xl shadow-slate-300/50 backdrop-blur-xl transition-all duration-300 sm:max-w-xl md:max-w-4xl md:border-white/20 md:bg-white/95 md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] lg:max-w-5xl xl:max-w-6xl">
        <div className="absolute left-0 top-0 z-20 h-2 w-full flex-shrink-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center p-16">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-500" />
              <p className="animate-pulse text-sm font-medium text-slate-400">
                Carregando portal...
              </p>
            </div>
          }
        >
          <ReceiptContent />
        </Suspense>
      </div>

      <p className="relative z-10 mb-4 mt-6 flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-slate-400 sm:mt-10 sm:text-xs md:text-slate-500">
        <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>SECURE DELIVERY SYSTEM</span>
      </p>
    </main>
  );
}
