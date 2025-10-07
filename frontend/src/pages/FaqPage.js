import React from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: "Comment ça marche pour emprunter un livre ?",
    a: "Il faut réserver le livre depuis son compte. Vous avez 3 jours pour venir le récupérer à la bibliothèque indiquée."
  },
  {
    q: "Qu'est-ce qui se passe si on ne récupère pas le livre au bout des 3 jours ?",
    a: "La réservation expire et le livre peut être réservé par une autre personne. Il ne sera plus réservé pour vous."
  },
  {
    q: "Puis-je annuler ma réservation ?",
    a: "Oui, vous pouvez annuler une réservation depuis votre espace personnel avant de récupérer le livre."
  },
  {
    q: "Combien de temps puis-je emprunter un livre ?",
    a: "La durée de prêt dépend de la bibliothèque : consultez les détails de la bibliothèque lors de la réservation."
  },
  {
    q: "Que faire si le livre est abîmé ou perdu ?",
    a: "Contactez la bibliothèque directement via la page de contact : des frais ou une procédure de remplacement peuvent s'appliquer."
  }
];

const FaqPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">FAQ — Questions fréquentes</h1>
        <p className="text-gray-600 mt-2">Retrouvez ici les réponses aux questions courantes sur l'utilisation de BiboLib.</p>
        <p className="mt-2 text-sm">Retour à la <Link to="/" className="text-blue-600 hover:underline">page d'accueil</Link>.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="p-4 border rounded bg-white">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="text-gray-700 mt-2">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
