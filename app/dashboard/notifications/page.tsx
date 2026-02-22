// app/dashboard/notifications/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock } from "lucide-react";

interface Notif {
  id: string;
  type: string;
  titre: string;
  message: string;
  lien: string | null;
  lu: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  nouvelle_offre: "💬",
  offre_acceptee: "🎉",
  paiement_securise: "🔒",
  paiement_confirme: "✅",
  livraison_recue: "📦",
  paiement_libere: "💰",
  message: "✉️",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => { setNotifs(data); setLoading(false); });
  }, []);

  const marquerLues = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const unreadCount = notifs.filter(n => !n.lu).length;

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label">Centre de notifications</p>
          <h1 className="font-syne font-extrabold text-3xl text-[var(--ink)] flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-lg font-normal bg-rust text-white px-3 py-1 rounded-full text-sm">
                {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={marquerLues}
            className="btn-secondary text-xs flex items-center gap-2 py-2.5">
            <CheckCheck size={14} /> Tout marquer lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[var(--bg2)] rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--bg2)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--bg2)] rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell size={40} className="text-[var(--muted)] mx-auto mb-4 opacity-30" />
          <p className="font-syne font-bold text-lg text-[var(--ink)]">Aucune notification</p>
          <p className="text-sm text-[var(--muted)] mt-1">Tu es à jour !</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(notif => {
            const Wrapper = notif.lien ? Link : "div";
            const wrapperProps = notif.lien ? { href: notif.lien } : {};

            return (
              <Wrapper
                key={notif.id}
                {...(wrapperProps as any)}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer
                  ${!notif.lu
                    ? "bg-gold-pale/50 border-gold/30 hover:border-gold"
                    : "card border-[var(--border)] hover:border-gold/50"
                  }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                  ${!notif.lu ? "bg-gold-pale" : "bg-[var(--bg2)]"}`}>
                  {TYPE_ICONS[notif.type] || "🔔"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-syne font-bold ${!notif.lu ? "text-gold" : "text-[var(--ink)]"}`}>
                      {notif.titre}
                    </p>
                    {!notif.lu && (
                      <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-[var(--muted)] mt-1.5 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(notif.createdAt).toLocaleDateString("fr-DZ", {
                      day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      )}
    </div>
  );
}
