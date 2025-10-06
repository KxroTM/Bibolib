-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 06 oct. 2025 à 22:11
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bibolib`
--

-- --------------------------------------------------------

--
-- Structure de la table `bibliotheques`
--

DROP TABLE IF EXISTS `bibliotheques`;
CREATE TABLE IF NOT EXISTS `bibliotheques` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `arrondissement` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `bibliotheques`
--

INSERT INTO `bibliotheques` (`id`, `name`, `adresse`, `telephone`, `email`, `arrondissement`) VALUES
(2, 'BIBLIOTHÈQUE GEORGES BRASSENS', '38, rue Gassendi', '01 53 90 30 30', 'bibliotheque.georges-brassens@paris.fr', 14),
(3, 'Bibliothèque Aimé Césaire', '5, rue de Ridder', '01 45 41 24 74', 'bibliotheque.aime-cesaire@paris.fr', 14),
(4, 'Bibliothèque benoîte groult', '25, rue du commandant René Mouchotte', '01 43 22 42 18', 'bibliotheque.benoite-groult@paris.fr', 10),
(5, 'BIBLIOTHÈqUE ANDRÉE CHEDID', '36-40, rue Emeriau', '01 45 77 63 40', 'bibliotheque.andree-chedid@paris.fr', 15),
(6, 'Bibliothèque Gutenberg', '8, rue de la Montagne d’Aulas', '01 45 54 69 76', 'bibliotheque.gutenberg@paris.fr', 15),
(7, 'Bibliothèque Vaugirard', '154, rue Lecourbe', '01 48 28 77 42', 'bibliotheque.vaugirard@paris.fr', 15),
(8, 'Médiathèque Marguerite Yourcenar', '41, rue d’Alleray', '01 45 30 71 41', 'mediatheque.marguerite-yourcenar@paris.fr', 15),
(9, 'BIBLIOTHÈqUE DE LA MAISON DE BALZAC', '47, rue Raynouard', '01 55 74 41 83', 'balzac.bibdoc@paris.fr', 16),
(10, 'Bibliothèque Germaine Tillion', '6, rue du Commandant Schloesing', '01 47 04 70 85', 'bibliotheque.germaine-tillion@paris.fr', 16),
(11, 'Bibliothèque du tourisme et des voyages (btv)', 'mêmes adresse que Germaine Tillion', 'mêmes téléphone que ', 'btv@paris.fr', 10),
(12, 'Bibliothèque Musset', '20, rue de Musset', '01 45 25 69 83', 'bibliotheque.musset@paris.fr', 10),
(13, 'BIBLIOTHÈqUE Batignolles', 'Mairie, 18 rue des Batignolles', '01 44 69 18 30', 'bibliotheque.batignolles@paris.fr', 17),
(14, 'Bibliothèque Colette Vivier', '6, rue Fourneyron', '01 42 28 69 94', 'bibliotheque.colette-vivier@paris.fr', 17),
(15, 'Médiathèque Edmond Rostand', '11, rue Nicolas Chuquet', '01 48 88 07 17', 'mediatheque.edmond-rostand@paris.fr', 17),
(16, 'Bibliothèque Robert Sabatier', '29, rue Hermel', '01 53 41 35 60', 'bibliotheque.robert-sabatier@paris.fr', 18),
(17, 'Bibliothèque Goutte d’Or', '2-4, rue Fleury', '01 53 09 26 10', 'bibliotheque.goutte-dor@paris.fr', 18),
(18, 'Bibliothèque Maurice Genevoix', '19, rue Tristan Tzara', '01 46 07 35 05', 'bibliotheque.maurice-genevoix@paris.fr', 18),
(19, 'Bibliothèque Jacqueline de Romilly', '16, avenue de la Porte-Montmartre', '01 42 55 60 20', 'bibliotheque.jacqueline-deromilly@paris.fr', 18),
(20, 'Bibliothèque Václav Havel', '26, esplanade Nathalie Sarraute', '01 40 38 65 40', 'bibliotheque.vaclav-havel@paris.fr', 10),
(21, 'BIBLIOTHÈqUE BENJAMIN RABIER', '141, avenue de Flandre', '01 42 09 31 24', 'bibliotheque.benjamin-rabier@paris.fr', 19),
(22, 'Bibliothèque Claude Lévi-Strauss', '41, avenue de Flandre', '01 40 35 96 46', 'bibliotheque.claude.levi-strauss@paris.fr', 19),
(23, 'Bibliothèque Astrid Lindgren', '42-44, rue Petit', '01 42 45 56 40', 'bibliotheque.crimee@paris.fr', 19),
(24, 'Bibliothèque des Archives de Paris', '18, boulevard Sérurier', '01 53 72 41 26', 'dac.archives@paris.fr', 19),
(25, 'Bibliothèque Jacqueline Dreyfus-Weill', '6, rue Fessart', '01 42 08 49 15', 'bibliotheque.fessart@paris.fr', 19),
(26, 'Bibliothèque Hergé', '2-4, rue du Département', '01 40 38 18 08', 'bibliotheque.herge@paris.fr', 10),
(27, 'Médiathèque James Baldwin', '10 bis, Rue Henri Ribière', '01 44 52 27 70', 'mediatheque.james-baldwin@paris.fr', 10),
(28, 'Bibliothèque Naguib Mahfouz', '66, rue des Couronnes', '01 40 33 26 01', 'bibliotheque.couronnes@paris.fr', 20),
(29, 'Bibliothèque Mortier', '113, boulevard Mortier', '01 43 61 74 64', 'bibliotheque.mortier@paris.fr', 20),
(30, 'Bibliothèque Louise Michel', '29/35, rue des Haies', '01 58 39 32 10', 'bibliotheque.louise-michel@paris.fr', 20),
(31, 'Bibliothèque Oscar Wilde', '12, rue du Télégraphe', '01 43 66 84 29', 'bibliotheque.oscar-wilde@paris.fr', 10),
(32, 'Bibliothèque Maryse Condé', '17, rue Sorbier', '01 46 36 17 79', 'bibliotheque.sorbier@paris.fr', 20),
(33, 'Médiathèque Marguerite Duras', '115, rue de Bagnolet', '01 55 25 49 10', 'mediatheque.marguerite-duras@paris.fr', 20),
(34, 'Bibliothèque Assia Djebar', '1, rue Reynaldo Hahn', '01 84 82 19 50', 'bibliotheque.assia-djebar@paris.fr', 10),
(35, 'MÉDIATHÈQUE VIOLETTE LEDUC', '18, rue Faidherbe', '01 55 25 80 20', 'mediatheque.violette-leduc@paris.fr', 11),
(36, 'Bibliothèque Toni Morrison', '20 bis, avenue Parmentier', '01 55 28 30 15', 'bibliotheque.parmentier@paris.fr', 11),
(37, 'Bibliothèque Diderot', '42, avenue Daumesnil', '01 43 40 69 94', 'bibliotheque.diderot@paris.fr', 12),
(38, 'Bibliothèque de la maison du jardinage', '41, rue Paul Belmondo', '01 53 46 19 19', 'bibliotheque.jardinage@paris.fr', 12),
(39, 'Bibliothèque DE L’ÉCOLE Du Breuil', 'Route de la ferme (Bois de Vincennes)', '01 53 66 14 02', 'bibliotheque.dubreuil@paris.fr', 10),
(40, 'Médiathèque Hélène Berr', '70, rue de Picpus', '01 43 45 87 12', 'mediatheque.helene-berr@paris.fr', 12),
(41, 'Bibliothèque Paris nature', 'Parc Floral - Pavillon 2', 'n/a', 'bibliotheque.nature@paris.fr', 10),
(42, 'Bibliothèque Saint-Éloi', '23, rue du Colonel Rozanoff', '01 53 44 70 30', 'bibliotheque.saint-eloi@paris.fr', 10),
(43, 'BIBLIOTHÈqUE DE L’ÉCOLE ESTIENNE', '18, boulevard Auguste-Blanqui', '01 55 43 47 64', 'bibliotheque@ecole-estienne.fr', 10),
(44, 'BIBLIOTHÈqUE GLACIÈRE MARINA TSVETAÏEVA', '132, rue de la Glacière', '01 45 89 55 47', 'bibliotheque.glaciere@paris.fr', 10),
(45, 'Bibliothèque Italie', '211-213, boulevard Vincent Auriol', '01 56 61 34 30', 'bibliotheque.italie@paris.fr', 13),
(46, 'Médiathèque Jean-Pierre Melville', '79, rue Nationale', '01 53 82 76 76', 'mediatheque.jean-pierre.melville@paris.fr', 13),
(47, 'Bibliothèque Marguerite Durand (BMD)', 'Même adresse que Médiathèque Jean-Pierre Melville', '01 53 82 76 77', 'bmd@paris.fr', 10),
(48, 'Médiathèque Virginia Woolf', '4, rue Germaine Krull', '01 44 08 12 71', 'mediatheque.virginia.woolf@paris.fr', 10),
(49, 'MÉDIATHÈQUE MUSICALE DE PARIS – Christiane Eda-Pierre', 'Forum des Halles, -8, Porte Saint-Eustache', '01 55 80 75 30', 'mmp@paris.fr', 1),
(50, 'BIBLIOTHÈQUE CHARLOTTE DELBO', '2, passage des Petits Pères', '01 53 29 74 30', 'bibliotheque.charlotte-delbo@paris.fr', 2),
(51, 'BIBLIOTHÈQUE MARGUERITE AUDOUX', '10, rue Portefoin', '01 44 78 55 20', 'bibliotheque.marguerite-audoux@paris.fr', 3),
(52, 'BIBLIOTHÈQUE ARTHUR RIMBAUD', '2, place Baudoyer', '01 44 54 76 70', 'bibliotheque.arthur-rimbaud@paris.fr', 4),
(53, 'BIBLIOTHÈQUE DE L’HÔTEL DE VILLE (Bhdv)', 'Hôtel de Ville, entrée: 29 rue de Rivoli', '01 42 76 48 87', 'bhdv@paris.fr', 1),
(54, 'BIBLIOTHÈQUE FORNEY', 'Hôtel de Sens, 1, rue du Figuier', '01 42 78 14 60', 'bibliotheque.forney@paris.fr', 4),
(55, 'BIBLIOTHÈQUE HISTORIQUE DE LA VILLE DE PARIS (BHVP)', 'Hôtel Lamoignon, 24, rue Pavée', '01 44 59 29 40', 'bhvp@paris.fr', 10),
(56, 'BIBLIOTHÈQUE BUFFON', '15 bis, rue Buffon', '01 55 43 25 25', 'bibliotheque.buffon@paris.fr', 10),
(57, 'CENTRE DE DOCUMENTATION SUR LES MÉTIERS DU LIVRE (CDML)', 'mêmes adresse que Buffon', '01 55 43 25 15', 'cdml@paris.fr', 10),
(58, 'Bibliothèque des Littératures Policières (BILIPO)', '48-50, rue du Cardinal Lemoine', '01 42 34 93 00', 'bilipo@paris.fr', 5),
(59, 'Bibliothèque L’Heure Joyeuse', '6-12, rue des Prêtres-Saint-Séverin', '01 80 05 47 60', 'bibliotheque.heurejoyeuse@paris.fr', 5),
(60, 'Bibliothèque Mohammed Arkoun', '74-76, rue Mouffetard', '01 43 37 96 54', 'bibliotheque.mohammed-arkoun@paris.fr', 5),
(61, 'Bibliothèque Rainer Maria Rilke', '88 ter, boulevard de Port-Royal', '01 56 81 10 70', 'bibliotheque.rainer-maria.rilke@paris.fr', 10),
(62, 'BIBLIOTHÈqUE ANDRÉ MALRAUX', '112, rue de Rennes', '01 45 44 53 85', 'bibliotheque.andre-malraux@paris.fr', 6),
(63, 'Bibliothèque Amelie', '164, rue de Grenelle', '01 47 05 89 66', 'bibliotheque.amelie@paris.fr', 7),
(64, 'Bibliothèque Saint-Simon', '116 rue de Grenelle (cour de la mairie porte D)', '01 53 58 76 40', 'bibliotheque.saint-simon@paris.fr', 7),
(65, 'BIBLIOTHÈqUE AGUSTINA BESSA-LUÍS', '17 ter, avenue Beaucour', '01 47 63 22 81', 'bibliotheque.courcelles@paris.fr', 8),
(66, 'Bibliothèque Jean d’Ormesson', 'Mairie, 3 rue de Lisbonne', '01 44 90 75 45', 'bibliotheque.europe@paris.fr', 8),
(67, 'BIBLIOTHÈqUE LOUISE WALSER-GAILLARD', '26, rue Chaptal', '01 49 70 92 80', 'bibliotheque.walser-gaillard@paris.fr', 9),
(68, 'Bibliothèque Drouot', '11, rue Drouot', '01 42 46 97 78', 'bibliotheque.drouot@paris.fr', 2),
(69, 'Bibliothèque Valeyre', '24, rue Marguerite de Rochechouart', '01 42 85 27 56', 'bibliotheque.valeyre@paris.fr', 9),
(70, 'BIBLIOTHÈQUE DU CINÉMA FRANÇOIS TRUFFAUT', 'Forum des Halles, niveau -3, 4 rue du Cinéma', '01 40 26 29 33', 'bibliotheque.cinema@paris.fr', 1),
(71, 'MédiaTHèque de la CANOPÉE La Fontaine', '10, passage de la Canopée', '01 44 50 76 56', 'mediatheque.canopee@paris.fr', 10),
(72, 'Bibliothèque François Villon', '81, boulevard de la Villette', '01 42 41 14 30', 'bibliotheque.francois-villon@paris.fr', 10),
(73, 'Médiathèque Françoise Sagan', '8 rue Léon Schwartzenberg', '01 53 24 69 70', 'mediatheque.francoise-sagan@paris.fr', 10),
(74, 'Fonds patrimonial Heure Joyeuse', '8 rue Léon Schwartzenberg', '01 53 24 69 70', 'bibliotheque.heurejoyeuse-patrimoine@paris.fr', 10),
(1, 'Bibliothèque Claire bretécher', '11, rue de Lancry', '01 42 03 25 98', 'bibliotheque.lancry@paris.fr', 10);

-- --------------------------------------------------------

--
-- Structure de la table `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `published_at` date DEFAULT NULL,
  `status` enum('disponible','emprunte') DEFAULT 'disponible',
  `bibliotheque_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bibliotheque_id` (`bibliotheque_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`) VALUES
(1, 'ADMIN_DASHBOARD', 'Accès au tableau de bord administrateur'),
(2, 'BOOK_MANAGE', 'Gestion des livres'),
(3, 'LIBRARY_MANAGE', 'Gestion des bibliothèques'),
(4, 'USER_MANAGE', 'Gestion des utilisateurs');

-- --------------------------------------------------------

--
-- Structure de la table `permission_role`
--

DROP TABLE IF EXISTS `permission_role`;
CREATE TABLE IF NOT EXISTS `permission_role` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `permission_role`
--

INSERT INTO `permission_role` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `reserved_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `due_date` datetime NOT NULL,
  `returned_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `book_id` (`book_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrateur'),
(2, 'user', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `role_user`
--

DROP TABLE IF EXISTS `role_user`;
CREATE TABLE IF NOT EXISTS `role_user` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `role_user`
--

INSERT INTO `role_user` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `created_at`) VALUES
(1, 'admin', 'scrypt:32768:8:1$lOTs0KqEMPdrIUrN$4958e4c03f27d1f93d64a9376447bd340cacd7f5ecc57f1df15a08e89c0cf90183ed1b7153009d7490cd133bce3cb7eb455e598fbeb5014a2243231c8f934e6f', 'admin@bibolib.fr', '2025-10-06 20:20:21'),
(2, 'test', 'scrypt:32768:8:1$16sUuR3HOyWraYHz$08cb22cc6167de8d18abfedfcd4c6c4f0ecf28db0622a60c518b3d8e8ff88848a22bd6b620971b4fc0079922c1fdad17443401c24822aaafdbf227eff61fb117', 'test@gmail.fr', '2025-10-06 19:00:00');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
