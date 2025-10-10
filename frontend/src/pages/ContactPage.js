import React, { useState } from 'react';
import { toast } from 'react-toastify';

const TEAM = [
  { name: 'Elias', github: 'https://github.com/elias', linkedin: 'https://www.linkedin.com/in/elias' },
  { name: 'Youssef', github: 'https://github.com/youssef', linkedin: 'https://www.linkedin.com/in/youssef' },
  { name: 'Giovanni', github: 'https://github.com/giovanni', linkedin: 'https://www.linkedin.com/in/giovanni' },
  { name: 'Ilyes', github: 'https://github.com/ilyes', linkedin: 'https://www.linkedin.com/in/ilyes' },
];

const ContactPage = () => {
  // Contact form removed — profiles only on this page

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <p className="text-gray-600 mb-6">Contactez-nous pour toute question, ou contactez directement les membres de l'équipe ci-dessous.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {TEAM.map(p => (
          <div key={p.name} className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
            <img src={`https://avatars.dicebear.com/api/initials/${encodeURIComponent(p.name)}.svg?background=%230c4a6e&color=%23fff`} alt={p.name} className="w-16 h-16 rounded-full" />
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="flex gap-3 mt-2">
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-blue-600">GitHub</a>
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">LinkedIn</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact form intentionally removed — show profiles only */}
    </div>
  );
};

export default ContactPage;
