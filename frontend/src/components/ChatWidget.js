import React, { useState, useRef, useEffect } from 'react';

const PREDEFINED_QUESTIONS = [
  "Quels sont les horaires d'ouverture ?",
  'Comment réserver un livre ?',
  'Où se trouve la bibliothèque la plus proche ?',
  'Comment créer un compte ?',
  'Quel est le statut de ma réservation ?'
];

function botReplyFor(text) {
  const t = String(text || '').toLowerCase();
  if (t.includes('horaire') || t.includes("ouverture")) {
    return "Les bibliothèques sont généralement ouvertes du mardi au dimanche de 10h à 18h. Certaines ont des horaires étendus le soir — vérifiez la page de la bibliothèque.";
  }
  if (t.includes('réserv') || t.includes('reserver') || t.includes('réserver')) {
    return "Pour réserver un livre : connectez-vous, ouvrez la fiche du livre et cliquez sur 'Réserver'. Vous recevrez une confirmation par e-mail si la réservation est acceptée.";
  }
  if (t.includes('proche') || t.includes('plus proche') || t.includes('où se trouve')) {
    return "Consultez la page Bibliothèques : elle contient les adresses et coordonnées pour trouver la bibliothèque la plus proche.";
  }
  if (t.includes('compte') || t.includes('créer') || t.includes('inscription')) {
    return "Pour créer un compte : allez sur la page d'inscription, remplissez le formulaire et validez. Vous pourrez ensuite réserver et gérer vos emprunts.";
  }
  if (t.includes('statut') || t.includes('reservation') || t.includes('réservation')) {
    return "Pour connaître le statut d'une réservation, rendez-vous dans votre espace personnel → Réservations. Si vous ne trouvez pas l'information, donnez-moi le n° de réservation.";
  }
  return "Désolé, je n'ai pas compris. Essaie une des questions prédéfinies ci-dessous ou reformule ta demande.";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
  { id: 1, from: 'bot', text: "Bonjour 👋 Je suis l'assistant Bibliothèque numérique. Pose ta question ou choisis une question rapide ci-dessous." }
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;
    const userMsg = { id: Date.now() + Math.random(), from: 'user', text };
    setMessages((p) => [...p, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply = botReplyFor(text);
      const botMsg = { id: Date.now() + Math.random(), from: 'bot', text: reply };
      setMessages((p) => [...p, botMsg]);
    }, 600);
  };

  return (
    <div style={{ zIndex: 2147483647 }} className="fixed right-0 bottom-6">
      <div className="relative">
        {/* Panel positioned to the left and slightly above the button */}
        <div
          style={{ position: 'absolute', right: '72px', bottom: '6px' }}
          className={`transform transition-all duration-200 ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'}`}>
          <div className="w-80 md:w-96 bg-white shadow-lg rounded-xl overflow-hidden flex flex-col border border-gray-200">
            <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-bold">B</div>
                <div>
                  <div className="text-sm font-semibold">Assistant Bibliothèque numérique</div>
                  <div className="text-xs opacity-80">Besoin d'aide ?</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Fermer"
                  onClick={() => setOpen(false)}
                  className="text-white/90 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-3 flex-1 overflow-hidden flex flex-col">
              <div ref={listRef} className="flex-1 overflow-auto space-y-3 pr-1">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`${m.from === 'bot' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'} max-w-[80%] px-3 py-2 rounded-lg`}>{m.text}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Questions rapides</div>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
                  placeholder="Écrire un message..."
                  className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  aria-label="Envoyer"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle button on the right */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 w-14 h-14 rounded-full bg-blue-600 shadow-xl flex items-center justify-center text-white text-2xl hover:bg-blue-700 ring-4 ring-white/20"
          style={{ boxShadow: '0 10px 30px rgba(2,6,23,0.4)' }}
          aria-label="Ouvrir le chat d'aide"
          title="Aide"
        >
          💬
        </button>
      </div>
    </div>
  );
}
