import { Package } from "lucide-react";

import { RomaneioData } from "@/lib/types/romaneio";

interface CargoVolumeListProps {
  variant?: "mobile" | "desktop";
  romaneioInfo: RomaneioData;
}

export function CargoVolumeList({
  variant = "desktop",
  romaneioInfo,
}: CargoVolumeListProps) {
  const volumes = romaneioInfo.volumesList ?? [];
  const items = romaneioInfo.itemsList ?? [];

  if (!volumes.length) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <div className="custom-scrollbar max-h-[300px] space-y-4 overflow-y-auto pr-3 md:hidden">
        {volumes.map((volume, volumeIndex) => (
          <div
            key={volume.id || volumeIndex}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-100/70 px-4 py-2.5 sm:px-5">
              <div className="flex min-w-0 items-center space-x-2 pr-2">
                <Package className="h-4 w-4 flex-shrink-0 text-slate-500" />
                <span className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-700 sm:text-xs">
                  Vol {volumeIndex + 1} - {volume.tipo}
                </span>
              </div>
              <span className="flex-shrink-0 rounded-full bg-slate-200/70 px-2.5 py-1 text-[10px] font-bold text-slate-600 sm:text-xs">
                {volume.items.length} itens
              </span>
            </div>

            <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
              {volume.items.map((volumeItem, itemIndex) => {
                const item = items.find(
                  (currentItem) => currentItem.id === volumeItem.itemId,
                );

                return (
                  <div
                    key={`${volume.id}-${itemIndex}`}
                    className="relative flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 flex-col items-center justify-center rounded-md border border-blue-100 bg-blue-50 sm:h-10 sm:w-10 sm:rounded-lg">
                      <span className="text-sm font-black leading-none text-blue-700 sm:text-base">
                        {volumeItem.qtd}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="mb-0.5 truncate font-mono text-[10px] font-bold text-slate-500 sm:text-xs">
                        {item?.codigo || `ID: ${volumeItem.itemId}`}
                      </p>
                      <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-slate-800 sm:text-[13px]">
                        {item?.descricao || "Descricao indisponivel"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden min-w-0 flex-1 flex-col overflow-hidden border-l border-slate-200 bg-slate-50/60 md:flex">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold leading-none text-slate-800 xl:text-base">
                Detalhes da carga
              </h3>
              <p className="mt-1 text-[11px] font-medium text-slate-500 xl:text-xs">
                {romaneioInfo.volumes} volumes no total
              </p>
            </div>
          </div>
        </div>

        <div className="custom-scrollbar relative z-0 flex-1 space-y-4 overflow-y-auto p-5 xl:space-y-5 xl:p-6">
          {volumes.map((volume, volumeIndex) => (
            <div
              key={volume.id || volumeIndex}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-100/50 px-5 py-3 transition-colors group-hover:bg-slate-100/80">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Volume {volumeIndex + 1}
                    <span className="mx-1 font-normal text-slate-400">-</span>
                    {volume.tipo}
                  </span>
                </div>
                <span className="rounded-full border border-slate-100 bg-white px-3 py-1 text-[10px] font-bold text-blue-600 shadow-sm">
                  {volume.items.length} itens
                </span>
              </div>

              <div className="space-y-4 p-4">
                {volume.items.map((volumeItem, itemIndex) => {
                  const item = items.find(
                    (currentItem) => currentItem.id === volumeItem.itemId,
                  );

                  return (
                    <div
                      key={`${volume.id}-${itemIndex}`}
                      className="relative flex items-center gap-4"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-50 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50">
                        <span className="text-sm font-black leading-none text-slate-700 transition-colors group-hover:text-blue-700 xl:text-base">
                          {volumeItem.qtd}
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="mb-0.5 truncate font-mono text-[10px] font-bold text-slate-400 transition-colors group-hover:text-blue-500/80 xl:text-xs">
                          {item?.codigo || `ID: ${volumeItem.itemId}`}
                        </p>
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-700 transition-colors group-hover:text-slate-900 xl:text-[13px]">
                          {item?.descricao || "Descricao indisponivel"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
