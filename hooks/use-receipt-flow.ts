"use client";

import { useEffect, useState } from "react";

import { ReceiptStatus, RomaneioData } from "@/lib/types/romaneio";

interface UseReceiptFlowParams {
  token: string | null;
}

interface ConfirmReceiptResult {
  confirmReceipt: () => Promise<void>;
  message: string;
  nameError: boolean;
  observation: string;
  recipientName: string;
  romaneioInfo: RomaneioData | null;
  setObservation: (value: string) => void;
  setRecipientName: (value: string) => void;
  status: ReceiptStatus;
}

export function useReceiptFlow({
  token,
}: UseReceiptFlowParams): ConfirmReceiptResult {
  const [status, setStatus] = useState<ReceiptStatus>("loading_info");
  const [message, setMessage] = useState("");
  const [romaneioInfo, setRomaneioInfo] = useState<RomaneioData | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [observation, setObservation] = useState("");

  useEffect(() => {
    async function fetchRomaneio() {
      if (!token) {
        setStatus("error");
        setMessage("O token de rastreio nao foi encontrado na URL.");
        return;
      }

      try {
        const response = await fetch(`/api/romaneio?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(
            data.message || "Link invalido, expirado ou romaneio ja entregue.",
          );
          return;
        }

        setRomaneioInfo(data);
        setStatus("idle");
      } catch {
        setStatus("error");
        setMessage("Erro de conexao ao buscar os dados da entrega.");
      }
    }

    fetchRomaneio();
  }, [token]);

  async function confirmReceipt() {
    if (!token) {
      return;
    }

    if (!recipientName.trim()) {
      setNameError(true);
      document.getElementById("recipientNameInput")?.focus();
      return;
    }

    setNameError(false);
    setStatus("loading_confirm");

    try {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          recipientName,
          observation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message || "Nao foi possivel confirmar o recebimento.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "Mercadoria entregue com sucesso.");
    } catch {
      setStatus("error");
      setMessage("Erro de conexao ao enviar a confirmacao.");
    }
  }

  return {
    confirmReceipt,
    message,
    nameError,
    observation,
    recipientName,
    romaneioInfo,
    setObservation,
    setRecipientName: (value: string) => {
      setRecipientName(value);
      if (value.trim()) {
        setNameError(false);
      }
    },
    status,
  };
}
