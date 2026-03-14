import { CheckCircle2 } from "lucide-react";

interface SuccessStateProps {
  message: string;
}

export function SuccessState({ message }: SuccessStateProps) {
  return (
    <div className="animate-in fade-in zoom-in p-10 text-center duration-700">
      <div className="mx-auto mb-6 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
        <CheckCircle2 className="h-12 w-12 text-white" />
      </div>

      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900">
        Sucesso!
      </h2>
      <p className="mb-8 text-lg font-medium text-slate-600">{message}</p>

      <div className="rounded-2xl border border-emerald-100 bg-slate-50 px-6 py-4">
        <p className="text-sm font-semibold text-emerald-700">
          O sistema ERP ja foi atualizado em tempo real.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Voce pode fechar esta aba com seguranca.
        </p>
      </div>
    </div>
  );
}
