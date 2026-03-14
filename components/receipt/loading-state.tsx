import { Truck } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-10">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" />
        <div className="relative z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-xl">
          <Truck className="h-10 w-10 animate-pulse text-white" />
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3 text-center">
        <h3 className="text-lg font-bold text-slate-800">Localizando encomenda</h3>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 rounded-full bg-blue-500 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Conectando aos servidores seguros...
        </p>
      </div>
    </div>
  );
}
