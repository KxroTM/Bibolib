import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Team was intentionally removed from footer — profiles live on the Contact page now.

const Footer = () => {
	const [email, setEmail] = useState('');

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error("Veuillez saisir une adresse e-mail valide.");
			return;
		}
		// simple local feedback (no backend)
		toast.success("Merci ! Vous êtes inscrit(e) à la newsletter.");
		setEmail('');
	};

	return (
		<footer className="bg-white border-t mt-12 text-gray-700">
			<div className="container mx-auto px-6 py-8">
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
					<div className="md:w-1/3">
						<Link to="/" className="inline-flex items-center space-x-2">
							
							<div className="flex items-center justify-center">
                <img
                src="/parislogo.png"
                alt="Logo"
                className="w-12s h-12 object-contain"
            />
            </div>

							<span className="text-lg font-semibold">Bibliothèque numérique</span>

						</Link>
						<p className="mt-3 text-sm text-gray-600">Découvrez et empruntez des livres dans votre réseau de bibliothèques. Recherche simple, réservations et prêt en un clic.</p>
					</div>

					<div className="grid grid-cols-2 gap-6 md:w-1/3">
						<div>
							<h4 className="text-sm font-semibold mb-2">Explorer</h4>
							<ul className="space-y-1 text-sm">
								<li><Link to="/livres" className="hover:text-gray-900">Livres</Link></li>
								<li><Link to="/bibliotheques" className="hover:text-gray-900">Bibliothèques</Link></li>
								<li><Link to="/" className="hover:text-gray-900">Nouveautés</Link></li>
							</ul>
						</div>

						<div>
							<h4 className="text-sm font-semibold mb-2">Support</h4>
								<ul className="space-y-1 text-sm">
									<li><Link to="/contact" className="hover:text-gray-900">Contact</Link></li>
									<li><Link to="/faq" className="hover:text-gray-900">FAQ</Link></li>
									<li><Link to="/conditions" className="hover:text-gray-900">Conditions</Link></li>
								</ul>
						</div>
					</div>

					<div className="md:w-1/3">
						<h4 className="text-sm font-semibold">Newsletter</h4>
						<p className="text-sm text-gray-600 mt-2">Recevez les nouveautés et événements locaux.</p>
						<form onSubmit={handleSubscribe} className="mt-3 flex items-center gap-2">
							<input
								type="email"
								aria-label="Email"
								placeholder="votre@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input-field w-full bg-gray-100 text-gray-800 px-3 py-2 rounded"
							/>
							<button type="submit" className="btn-primary px-3 py-2 rounded">OK</button>
						</form>

						<div className="flex items-center space-x-3 mt-4">
							<a href="#" aria-label="Twitter" className="text-gray-500 hover:text-gray-800">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.92c-.63.28-1.3.47-2 .55.72-.43 1.27-1.11 1.53-1.92-.67.4-1.41.7-2.2.86C18.5 4.5 17.19 4 15.79 4c-2.3 0-4.17 1.87-4.17 4.17 0 .33.04.65.11.96C7.69 9.04 4.07 7.13 1.64 4.15c-.36.62-.56 1.34-.56 2.11 0 1.46.74 2.75 1.87 3.51-.6-.02-1.17-.18-1.67-.46v.05c0 2.03 1.45 3.72 3.37 4.1-.35.1-.72.15-1.1.15-.27 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.94 2.98-1.44 1.13-3.24 1.8-5.2 1.8-.34 0-.68-.02-1.01-.06 1.87 1.2 4.08 1.9 6.46 1.9 7.75 0 12-6.42 12-12v-.55c.83-.6 1.55-1.34 2.12-2.19-.76.34-1.58.57-2.43.67z"/></svg>
							</a>
							<a href="#" aria-label="Facebook" className="text-gray-500 hover:text-gray-800">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.88h2.74l-.44 2.89h-2.3V21.9C18.34 21.12 22 16.99 22 12z"/></svg>
							</a>
							<a href="#" aria-label="Instagram" className="text-gray-500 hover:text-gray-800">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm6.5-.75a1.12 1.12 0 1 1-1.12 1.12A1.12 1.12 0 0 1 18.5 6.75zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
							</a>
						</div>
					</div>

					{/* Team removed from footer */}
				</div>

				<div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
					© {new Date().getFullYear()} Bibliothèque numérique — Tous droits réservés • Conçu par Youssef Giovanni Ilyes
				</div>
			</div>
		</footer>
	);
};

export default Footer;
