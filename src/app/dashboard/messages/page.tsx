import React from "react";

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-0px)] flex">
      <div className="w-80 border-r border-[#e2e8f0] bg-white">
        <div className="p-4 border-b border-[#e2e8f0]">
          <h1 className="text-lg font-bold text-[#111418]">Mesaje</h1>
          <p className="text-xs text-text-muted mt-1">
            Conversații cu cumpărătorii.
          </p>
        </div>

        <div className="p-2">
          {/* Conversation item */}
          <button
            className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors"
            type="button"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#111418]">Buyer SRL</p>
              <span className="text-[10px] text-text-muted">12:41</span>
            </div>
            <p className="text-xs text-text-muted mt-1 truncate">
              Salut, mai este disponibil lotul?
            </p>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#f8f9fa]">
        <div className="h-16 border-b border-[#e2e8f0] bg-white px-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#111418]">
              Selectează o conversație
            </p>
            <p className="text-xs text-text-muted">Aici va apărea chat-ul.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 text-sm text-text-muted">
            MVP: UI first. Next: hook to `conversations` + `messages` tables +
            realtime.
          </div>
        </div>
      </div>
    </div>
  );
}
