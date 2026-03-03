import { useEffect, useState } from "react";

export default function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(()=> setMsg(""), 2200);
    return () => clearTimeout(id);
  }, [msg]);

  const el = msg ? (
    <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg">{msg}</div>
  ) : null;

  return { toast: setMsg, ToastEl: el };
}