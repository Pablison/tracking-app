"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { CheckCircle2, AlertCircle, Loader2, Truck, Package, Calendar, ChevronDown, FileText } from "lucide-react";

interface RomaneioItem {
    id: number;
    codigo: string;
    descricao: string;
    qtd: number;
    local?: string;
}

interface RomaneioItemMini {
    itemId: number;
    qtd: number;
}

interface RomaneioVolume {
    id: number;
    tipo: string;
    items: RomaneioItemMini[];
}

interface RomaneioData {
    id: string;
    cliente: string;
    dataEnvio: string;
    volumes: number;
    itens: number;
    itemsList?: RomaneioItem[]; // Note: AdvPL will inject this array
    volumesList?: RomaneioVolume[]; // Note: AdvPL will inject this array
}

function formatDeliveryDate(dateStr: string) {
    if (!dateStr) return { date: "", time: "" };
    const parts = dateStr.split(" ");
    const d = parts[0];
    const time = parts[1] || "";

    let date = d;
    if (d && d.length === 8 && !d.includes("-") && !d.includes("/")) {
        const year = d.substring(0, 4);
        const month = d.substring(4, 6);
        const day = d.substring(6, 8);
        date = `${day}/${month}/${year}`;
    }
    return { date, time };
}

function ConfirmationForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading_info" | "idle" | "loading_confirm" | "success" | "error">("loading_info");
    const [message, setMessage] = useState("");
    const [romaneioInfo, setRomaneioInfo] = useState<RomaneioData | null>(null);
    const [showItems, setShowItems] = useState(false);
    const [recipientName, setRecipientName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [observation, setObservation] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("O token de rastreio não foi encontrado na URL.");
            return;
        }

        const fetchRomaneio = async () => {
            try {
                const res = await fetch(`/api/romaneio?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setRomaneioInfo(data);
                    setStatus("idle");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Link inválido, expirado ou romaneio já entregue.");
                }
            } catch (err) {
                setStatus("error");
                setMessage("Erro de conexão ao buscar os dados da entrega.");
            }
        };

        fetchRomaneio();
    }, [token]);

    const handleConfirm = async () => {
        if (!token) return;

        if (!recipientName.trim()) {
            setNameError(true);
            const inputElement = document.getElementById("recipientNameInput");
            if (inputElement) {
                inputElement.focus();
            }
            return;
        }

        setNameError(false);
        setStatus("loading_confirm");

        try {
            const res = await fetch("/api/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, recipientName, observation }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "Mercadoria entregue com sucesso!");
            } else {
                setStatus("error");
                setMessage(data.message || "Não foi possível confirmar o recebimento.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Erro de conexão ao enviar a confirmação.");
        }
    };

    if (status === "loading_info") {
        return (
            <div className="p-10 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl relative z-10 flex-shrink-0">
                        <Truck className="w-10 h-10 text-white animate-pulse" />
                    </div>
                </div>
                <div className="space-y-3 text-center w-full max-w-xs">
                    <h3 className="text-lg font-bold text-slate-800">Localizando Encomenda</h3>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Conectando aos servidores seguros...</p>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="text-center p-10 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] flex-shrink-0">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Sucesso!</h2>
                <p className="text-slate-600 font-medium mb-8 text-lg">{message}</p>
                <div className="bg-slate-50 border border-emerald-100 px-6 py-4 rounded-2xl">
                    <p className="text-emerald-700 text-sm font-semibold">O sistema ERP já foi atualizado em tempo real.</p>
                    <p className="text-slate-500 text-xs mt-1">Você pode fechar esta aba com segurança.</p>
                </div>
            </div>
        );
    }

    const deliveryDate = romaneioInfo ? formatDeliveryDate(romaneioInfo.dataEnvio) : { date: "", time: "" };

    return (
        <div className="flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500 relative w-full" style={{ maxHeight: 'calc(100vh - 160px)' }}>

            {/* Esquerda: Info Card + Formulário */}
            <div className="w-full md:w-1/2 flex-shrink-0 overflow-y-auto no-scrollbar p-6 sm:p-10" style={{ maxHeight: 'inherit' }}>
                <div className="text-center mb-6 sm:mb-8 mt-2 md:text-left md:flex md:items-center md:space-x-5">
                    <div className="inline-block p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-3xl shadow-lg mb-4 md:mb-0 rotate-3 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[20px] sm:rounded-[22px] flex items-center justify-center">
                            <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-2 tracking-tight">Confirmação de Entrega</h1>
                        <p className="text-slate-500 text-[14px] sm:text-[15px] max-w-[340px] mx-auto md:mx-0 leading-relaxed md:pr-4">
                            Verifique os detalhes da remessa abaixo antes de assinar digitalmente o recebimento.
                        </p>
                    </div>
                </div>

                {/* Premium Romaneio Card */}
                {romaneioInfo && (
                    <div className="bg-white border border-slate-200/60 rounded-2xl mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center shadow-sm border border-amber-100">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                            Aguardando
                        </div>

                        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                            <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Destinatário</p>
                            <p className="text-slate-800 font-bold text-base sm:text-lg leading-snug pr-28">{romaneioInfo.cliente}</p>
                        </div>

                        <div className="p-5 sm:p-6 grid grid-cols-2 gap-y-6 gap-x-6 sm:gap-x-10">
                            <div className="flex items-start space-x-3 sm:space-x-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100/50">
                                    <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="pt-0.5 sm:pt-1 min-w-0">
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Carga</p>
                                    <p className="text-slate-900 font-black text-lg sm:text-xl leading-none mb-1">{romaneioInfo.volumes} <span className="text-slate-500 text-sm sm:text-base font-semibold ml-0.5">vols</span></p>
                                    <p className="text-slate-500 text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap">({romaneioInfo.itens} itens)</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 sm:space-x-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-indigo-100/50">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="pt-0.5 sm:pt-1 min-w-0">
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Expedição</p>
                                    <p className="text-slate-900 font-bold text-sm sm:text-base md:text-[15px] mt-1 whitespace-nowrap">{deliveryDate.date}</p>
                                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">{deliveryDate.time}</p>
                                </div>
                            </div>
                        </div>

                        {/* Expandable Volumes/Items List - MOBILE ONLY (Hidden on MD breakpoint) */}
                        {romaneioInfo.volumesList && romaneioInfo.volumesList.length > 0 && romaneioInfo.itemsList && (
                            <div className="border-t border-slate-100 md:hidden">
                                <button
                                    onClick={() => setShowItems(!showItems)}
                                    className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-sm sm:text-[15px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        <span>Ver detalhes da carga ({romaneioInfo.volumesList.length} vols)</span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showItems ? 'rotate-180' : ''}`} />
                                </button>

                                {showItems && (
                                    <div className="px-5 sm:px-6 pb-6 pt-2 bg-slate-50 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                                            {romaneioInfo.volumesList.map((vol, vIdx) => (
                                                <div key={vol.id || vIdx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                                    <div className="bg-slate-100/70 px-4 sm:px-5 py-2.5 border-b border-slate-100 flex justify-between items-center">
                                                        <div className="flex items-center space-x-2 min-w-0 pr-2">
                                                            <Package className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                            <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide truncate">
                                                                Vol {vIdx + 1} • {vol.tipo}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] sm:text-xs font-bold bg-slate-200/70 text-slate-600 px-2.5 py-1 rounded-full flex-shrink-0">{vol.items.length} itens</span>
                                                    </div>
                                                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                                                        {vol.items.map((vi, iIdx) => {
                                                            const itemDetail = romaneioInfo.itemsList?.find(i => i.id === vi.itemId);
                                                            return (
                                                                <div key={iIdx} className="flex gap-3 relative items-center">
                                                                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-md sm:rounded-lg flex flex-col items-center justify-center border border-blue-100">
                                                                        <span className="text-sm sm:text-base text-blue-700 font-black leading-none">{vi.qtd}</span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                        <p className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 mb-0.5 truncate">{itemDetail?.codigo || `ID: ${vi.itemId}`}</p>
                                                                        <p className="text-[11px] sm:text-[13px] text-slate-800 font-semibold leading-snug line-clamp-2">{itemDetail?.descricao || 'Carregando descrição...'}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-slate-50/80 px-5 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs text-slate-400 font-medium flex justify-between items-center border-t border-slate-100 mt-auto">
                            <span>ID Documento:</span>
                            <span className="font-mono text-slate-600 bg-slate-200/50 px-2 py-0.5 rounded sm:px-2.5 sm:py-1 text-[10px] sm:text-xs">{romaneioInfo.id}</span>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl mb-6 text-sm flex items-start text-left shadow-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mr-3 mt-0.5 text-red-500" />
                        <span className="font-medium">{message}</span>
                    </div>
                )}

                {status !== "error" && (
                    <div className="flex flex-col gap-4">
                        <div className={`transition-all duration-300 ${nameError ? 'animate-shake' : ''}`}>
                            {/* Observation field - Optional */}
                            <label htmlFor="recipientNameInput" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                                Nome do Recebedor <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="recipientNameInput"
                                type="text"
                                placeholder="Digite o nome de quem está recebendo..."
                                value={recipientName}
                                onChange={(e) => {
                                    setRecipientName(e.target.value);
                                    if (e.target.value.trim().length > 0) setNameError(false);
                                }}
                                className={`w-full px-4 py-3 sm:py-4 rounded-xl border ${nameError ? 'border-red-400 bg-red-50/50 focus:ring-red-500' : 'border-slate-200 bg-white focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm text-slate-800 font-medium placeholder:text-slate-400`}
                                disabled={status === "loading_confirm"}
                            />
                            {nameError && (
                                <p className="text-red-500 text-xs font-medium mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                                    Por favor, preencha o nome do recebedor antes de confirmar.
                                </p>
                            )}
                        </div>

                        {/* Observação - Opcional */}
                        <div>
                            <label htmlFor="observationInput" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                                Observações <span className="text-slate-400 font-normal normal-case">( opcional – informe divergências )</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    id="observationInput"
                                    placeholder="Ex: Caixa 2 chegou amassada, faltou 1 unidade do produto X..."
                                    value={observation}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 300) setObservation(e.target.value);
                                    }}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm text-slate-800 font-medium placeholder:text-slate-400 resize-none text-sm"
                                    disabled={status === "loading_confirm"}
                                />
                                <span className={`absolute bottom-2.5 right-3 text-[10px] font-bold tabular-nums ${observation.length >= 280 ? 'text-amber-500' : 'text-slate-300'}`}>
                                    {observation.length}/300
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirm}
                            disabled={status === "loading_confirm"}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:opacity-70 disabled:filter-grayscale disabled:cursor-not-allowed text-white font-bold py-4 px-6 sm:py-5 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center space-x-3 relative overflow-hidden group mb-2 flex-shrink-0"
                        >
                            {/* Botão Glow Effect */}
                            <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

                            {status === "loading_confirm" ? (
                                <>
                                    <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin flex-shrink-0" />
                                    <span className="tracking-wide text-sm sm:text-base">PROCESSANDO...</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-wide text-sm sm:text-[16px]">SIM, RECEBI A MERCADORIA</span>
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-125 transition-transform duration-300 flex-shrink-0" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Direita: Volumes List (Desktop Only) */}
            {romaneioInfo && romaneioInfo.volumesList && romaneioInfo.volumesList.length > 0 && (
                <div className="hidden md:flex flex-col flex-1 min-w-0 bg-slate-50/60 border-l border-slate-200 overflow-hidden" style={{ maxHeight: 'inherit' }}>
                    <div className="px-6 py-5 bg-white/90 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between shadow-sm z-10 sticky top-0">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl">
                                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-sm xl:text-base leading-none">Detalhes da Carga</h3>
                                <p className="text-[11px] xl:text-xs text-slate-500 font-medium mt-1">{romaneioInfo.volumes} volumes no total</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 xl:p-6 space-y-4 xl:space-y-5 custom-scrollbar relative z-0">
                        {romaneioInfo.volumesList.map((vol, vIdx) => (
                            <div key={vol.id || vIdx} className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:bg-white transition-all duration-300 group">
                                <div className="bg-slate-100/50 group-hover:bg-slate-100/80 px-5 py-3 border-b border-slate-100 flex justify-between items-center transition-colors">
                                    <div className="flex items-center space-x-2">
                                        <Package className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                            Volume {vIdx + 1} <span className="text-slate-400 font-normal mx-1">•</span> {vol.tipo}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-white text-blue-600 px-3 py-1 rounded-full shadow-sm border border-slate-100">{vol.items.length} itens</span>
                                </div>
                                <div className="p-4 space-y-4">
                                    {vol.items.map((vi, iIdx) => {
                                        const itemDetail = romaneioInfo.itemsList?.find(i => i.id === vi.itemId);
                                        return (
                                            <div key={iIdx} className="flex gap-4 relative items-center">
                                                <div className="flex-shrink-0 w-10 h-10 bg-slate-50 group-hover:bg-blue-50 rounded-lg flex flex-col items-center justify-center border border-slate-100 group-hover:border-blue-100 transition-colors">
                                                    <span className="text-sm xl:text-base text-slate-700 group-hover:text-blue-700 font-black leading-none">{vi.qtd}</span>
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="text-[10px] xl:text-xs font-mono font-bold text-slate-400 group-hover:text-blue-500/80 mb-0.5 truncate transition-colors">{itemDetail?.codigo || `ID: ${vi.itemId}`}</p>
                                                    <p className="text-xs xl:text-[13px] text-slate-700 group-hover:text-slate-900 font-semibold leading-snug line-clamp-2 transition-colors">{itemDetail?.descricao || 'Carregando descrição...'}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ReceiptPage() {
    return (
        <main className="min-h-screen bg-slate-100 md:bg-slate-900 transition-colors duration-500 flex flex-col items-center justify-center p-4 md:p-8 selection:bg-blue-200 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 md:bg-blue-500/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 md:bg-indigo-500/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>

            <div className="pt-4 md:pt-0 mb-3 md:mb-5 font-black text-2xl sm:text-4xl text-slate-300 md:text-slate-200/20 tracking-tighter relative z-10 drop-shadow-sm md:drop-shadow-none transition-colors duration-500">
                FISCAL<span className="text-blue-600 md:text-blue-500/80">TECH</span>
            </div>

            <div className="w-full sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-white/80 md:bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-300/50 md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/50 md:border-white/20 overflow-hidden relative z-10 flex flex-col transition-all duration-300">
                <div className="h-2 w-full flex-shrink-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 absolute top-0 left-0 z-20"></div>

                <Suspense fallback={
                    <div className="p-16 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                        <p className="text-slate-400 font-medium text-sm animate-pulse">Carregando portal...</p>
                    </div>
                }>
                    <ConfirmationForm />
                </Suspense>
            </div>

            <p className="mt-6 sm:mt-10 text-[10px] sm:text-xs font-bold text-slate-400 md:text-slate-500 tracking-[0.2em] relative z-10 flex items-center space-x-2 mb-4">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>SECURE DELIVERY SYSTEM</span>
            </p>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </main>
    );
}
