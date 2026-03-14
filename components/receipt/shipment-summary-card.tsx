"use client";

import { Calendar, ChevronDown, FileText, Package } from "lucide-react";
import { useState } from "react";

import { RomaneioData } from "@/lib/types/romaneio";
import { formatDeliveryDate } from "@/lib/utils/format-delivery-date";

import { CargoVolumeList } from "./cargo-volume-list";

interface ShipmentSummaryCardProps {
  romaneioInfo: RomaneioData;
}

export function ShipmentSummaryCard({
  romaneioInfo,
}: ShipmentSummaryCardProps) {
  const [showItems, setShowItems] = useState(false);
  const deliveryDate = formatDeliveryDate(romaneioInfo.dataEnvio);
  const hasVolumes = (romaneioInfo.volumesList?.length ?? 0) > 0;

  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="absolute right-4 top-4 flex items-center rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 shadow-sm sm:right-5 sm:top-5 sm:text-xs">
          <div className="mr-2 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          Aguardando
        </div>

        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 sm:p-6">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
            Destinatario
          </p>
          <p className="pr-28 text-base font-bold leading-snug text-slate-800 sm:text-lg">
            {romaneioInfo.cliente}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-6 p-5 sm:gap-x-10 sm:p-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100/50 bg-blue-50 text-blue-600 shadow-sm sm:h-12 sm:w-12">
              <Package className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 pt-0.5 sm:pt-1">
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                Carga
              </p>
              <p className="mb-1 text-lg font-black leading-none text-slate-900 sm:text-xl">
                {romaneioInfo.volumes}
                <span className="ml-0.5 text-sm font-semibold text-slate-500 sm:text-base">
                  {" "}
                  vols
                </span>
              </p>
              <p className="whitespace-nowrap text-[11px] font-medium text-slate-500 sm:text-xs md:text-sm">
                ({romaneioInfo.itens} itens)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100/50 bg-indigo-50 text-indigo-600 shadow-sm sm:h-12 sm:w-12">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 pt-0.5 sm:pt-1">
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                Expedicao
              </p>
              <p className="mt-1 whitespace-nowrap text-sm font-bold text-slate-900 sm:text-base md:text-[15px]">
                {deliveryDate.date}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                {deliveryDate.time}
              </p>
            </div>
          </div>
        </div>

        {hasVolumes && (
          <div className="border-t border-slate-100 md:hidden">
            <button
              type="button"
              onClick={() => setShowItems((currentValue) => !currentValue)}
              className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:px-6 sm:text-[15px]"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <span>
                  Ver detalhes da carga ({romaneioInfo.volumesList?.length} vols)
                </span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                  showItems ? "rotate-180" : ""
                }`}
              />
            </button>

            {showItems && (
              <div className="animate-in slide-in-from-top-2 bg-slate-50 px-5 pb-6 pt-2 duration-300 sm:px-6">
                <CargoVolumeList variant="mobile" romaneioInfo={romaneioInfo} />
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-3 text-[11px] font-medium text-slate-400 sm:px-6 sm:py-4 sm:text-xs">
          <span>ID Documento:</span>
          <span className="rounded bg-slate-200/50 px-2 py-0.5 font-mono text-[10px] text-slate-600 sm:px-2.5 sm:py-1 sm:text-xs">
            {romaneioInfo.id}
          </span>
        </div>
      </div>

    </>
  );
}
