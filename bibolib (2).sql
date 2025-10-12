-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 12 oct. 2025 à 21:10
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
-- Structure de la table `book`
--

DROP TABLE IF EXISTS `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `livre_id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `titre` text,
  `auteur` varchar(255) DEFAULT NULL,
  `editeur` varchar(255) DEFAULT NULL,
  `resume` text,
  `categorie` varchar(255) DEFAULT NULL,
  `annee` text,
  `isbn` varchar(50) DEFAULT NULL,
  `langue` varchar(50) DEFAULT NULL,
  `statut` varchar(50) DEFAULT 'Disponible',
  `bibliotheque_id` int DEFAULT NULL,
  `pages` int DEFAULT NULL,
  PRIMARY KEY (`livre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `book`
--

INSERT INTO `book` (`livre_id`, `image_url`, `titre`, `auteur`, `editeur`, `resume`, `categorie`, `annee`, `isbn`, `langue`, `statut`, `bibliotheque_id`, `pages`) VALUES
(1, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9782384785850', 'français', 'Disponible', 41, 453),
(2, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9784195285509', 'français', 'Disponible', 13, 533),
(3, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1859', '9787776488202', 'français', 'Disponible', 6, 502),
(4, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1980', '9781309654002', 'français', 'Disponible', 19, 217),
(5, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1944', '9783866333515', 'français', 'Disponible', 37, 399),
(6, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1887', '9786881858542', 'français', 'Disponible', 6, 111),
(7, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9784736735383', 'français', 'Disponible', 3, 546),
(8, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9787915791243', 'français', 'Disponible', 38, 519),
(9, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9782571229322', 'français', 'Disponible', 13, 208),
(10, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1976', '9784290373194', 'français', 'Disponible', 1, 260),
(11, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1951', '9784901238936', 'français', 'Disponible', 9, 142),
(12, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1854', '9783968154934', 'français', 'Disponible', 22, 773),
(13, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9784904511676', 'français', 'Disponible', 25, 763),
(14, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9787378875332', 'français', 'Disponible', 67, 622),
(15, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9788806653851', 'français', 'Disponible', 74, 755),
(16, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9783274909474', 'français', 'Disponible', 16, 116),
(17, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9787226606811', 'français', 'Disponible', 67, 593),
(18, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1949', '9784575692729', 'français', 'Disponible', 31, 172),
(19, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9782913333788', 'français', 'Disponible', 39, 544),
(20, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1813', '9781144858125', 'français', 'Disponible', 71, 689),
(21, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9781432506656', 'français', 'Disponible', 15, 635),
(22, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1949', '9785618070889', 'français', 'Disponible', 54, 365),
(23, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9782918434636', 'français', 'Disponible', 32, 349),
(24, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9789700035493', 'français', 'Disponible', 44, 737),
(25, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1998', '9782303472055', 'français', 'Disponible', 32, 338),
(26, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9783923598831', 'français', 'Disponible', 59, 769),
(27, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1925', '9787691781923', 'français', 'Disponible', 43, 177),
(28, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1933', '9789272990973', 'français', 'Disponible', 58, 182),
(29, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9783842113898', 'français', 'Disponible', 39, 483),
(30, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9788797061838', 'français', 'Disponible', 12, 330),
(31, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9788590347920', 'français', 'Disponible', 70, 224),
(32, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9783530985554', 'français', 'Disponible', 6, 791),
(33, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9781670962541', 'français', 'Disponible', 68, 781),
(34, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1951', '9786332595256', 'français', 'Disponible', 70, 570),
(35, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1921', '9783291452512', 'français', 'Disponible', 49, 395),
(36, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9787994099053', 'français', 'Disponible', 36, 309),
(37, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9784498568626', 'français', 'Disponible', 28, 328),
(38, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9782729329969', 'français', 'Disponible', 50, 715),
(39, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9786104071686', 'français', 'Disponible', 12, 467),
(40, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9788558094129', 'français', 'Disponible', 29, 437),
(41, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9785409252643', 'français', 'Disponible', 39, 462),
(42, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1949', '9783645056907', 'français', 'Disponible', 71, 627),
(43, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9787693339124', 'français', 'Disponible', 70, 664),
(44, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9789495350879', 'français', 'Disponible', 60, 246),
(45, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1949', '9781246896961', 'français', 'Disponible', 17, 132),
(46, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9789122976587', 'français', 'Disponible', 18, 411),
(47, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9783800851331', 'français', 'Disponible', 37, 780),
(48, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1964', '9782913019943', 'français', 'Disponible', 28, 595),
(49, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9784985470917', 'français', 'Disponible', 42, 105),
(50, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1949', '9787103418613', 'français', 'Disponible', 67, 178),
(51, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9785594407618', 'français', 'Disponible', 22, 203),
(52, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9789162799654', 'français', 'Disponible', 53, 392),
(53, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9785188643845', 'français', 'Disponible', 39, 299),
(54, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1949', '9781588068751', 'français', 'Disponible', 37, 464),
(55, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9784198136086', 'français', 'Disponible', 57, 654),
(56, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9786655557300', 'français', 'Disponible', 56, 453),
(57, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9782022304283', 'français', 'Disponible', 55, 477),
(58, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1949', '9788648951646', 'français', 'Disponible', 47, 697),
(59, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9789314639659', 'français', 'Disponible', 8, 341),
(60, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9786723522026', 'français', 'Disponible', 6, 303),
(61, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9789372621486', 'français', 'Disponible', 31, 472),
(62, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1949', '9781066293706', 'français', 'Disponible', 50, 669),
(63, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9785372389617', 'français', 'Disponible', 35, 126),
(64, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9789507943372', 'français', 'Disponible', 29, 180),
(65, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '2023', '9785260094512', 'français', 'Disponible', 35, 553),
(66, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9787006103548', 'français', 'Disponible', 27, 512),
(67, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1813', '9782385047006', 'français', 'Disponible', 63, 486),
(68, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9787903973851', 'français', 'Disponible', 42, 614),
(69, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9787071811137', 'français', 'Disponible', 15, 271),
(70, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9786062720222', 'français', 'Disponible', 15, 309),
(71, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1949', '9788407690612', 'français', 'Disponible', 66, 669),
(72, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1912', '9782183966550', 'français', 'Disponible', 68, 791),
(73, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9786839544109', 'français', 'Disponible', 18, 112),
(74, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9781364690103', 'français', 'Disponible', 29, 434),
(75, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1937', '9785182178640', 'français', 'Disponible', 27, 697),
(76, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9785574999806', 'français', 'Disponible', 11, 311),
(77, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9786397303917', 'français', 'Disponible', 62, 117),
(78, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9788760956277', 'français', 'Disponible', 50, 129),
(79, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9783806379945', 'français', 'Disponible', 57, 142),
(80, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9787720323856', 'français', 'Disponible', 36, 619),
(81, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '2000', '9789853692151', 'français', 'Disponible', 28, 557),
(82, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9781318253537', 'français', 'Disponible', 23, 682),
(83, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1949', '9786303021521', 'français', 'Disponible', 44, 731),
(84, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9786061474289', 'français', 'Disponible', 13, 264),
(85, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1925', '9788994523429', 'français', 'Disponible', 27, 104),
(86, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9781838320743', 'français', 'Disponible', 39, 322),
(87, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1813', '9782694153523', 'français', 'Disponible', 4, 702),
(88, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1941', '9786380057172', 'français', 'Disponible', 37, 182),
(89, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1929', '9789645172040', 'français', 'Disponible', 48, 236),
(90, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9788462723771', 'français', 'Disponible', 42, 206),
(91, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9787014682262', 'français', 'Disponible', 31, 431),
(92, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1861', '9788822473761', 'français', 'Disponible', 68, 648),
(93, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1866', '9787366737950', 'français', 'Disponible', 48, 723),
(94, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9784120904761', 'français', 'Disponible', 13, 586),
(95, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9786362929394', 'français', 'Disponible', 69, 574),
(96, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9788919546024', 'français', 'Disponible', 69, 705),
(97, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9789553541574', 'français', 'Disponible', 66, 167),
(98, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1929', '9789012725228', 'français', 'Disponible', 65, 712),
(99, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9782747344969', 'français', 'Disponible', 13, 628),
(100, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1949', '9785709558282', 'français', 'Disponible', 47, 140),
(101, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9783290540190', 'français', 'Disponible', 21, 203),
(102, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9786256490610', 'français', 'Disponible', 44, 670),
(103, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9785025021859', 'français', 'Disponible', 48, 688),
(104, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9788490867320', 'français', 'Disponible', 46, 594),
(105, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9787579699092', 'français', 'Disponible', 40, 432),
(106, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1813', '9789557636794', 'français', 'Disponible', 13, 704),
(107, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1903', '9788808452409', 'français', 'Disponible', 13, 732),
(108, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9789489754329', 'français', 'Disponible', 40, 463),
(109, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9788624967609', 'français', 'Disponible', 16, 119),
(110, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1907', '9787140418472', 'français', 'Disponible', 71, 101),
(111, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1940', '9786117848889', 'français', 'Disponible', 6, 456),
(112, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9784961067961', 'français', 'Disponible', 61, 594),
(113, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9785393482319', 'français', 'Disponible', 36, 529),
(114, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9781579345918', 'français', 'Disponible', 5, 760),
(115, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9789628601196', 'français', 'Disponible', 50, 351),
(116, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9784562860563', 'français', 'Disponible', 51, 579),
(117, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9783350732392', 'français', 'Disponible', 49, 250),
(118, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1949', '9781612849988', 'français', 'Disponible', 46, 703),
(119, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9786374094770', 'français', 'Disponible', 72, 246),
(120, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9781227519117', 'français', 'Disponible', 17, 536),
(121, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1949', '9789784611335', 'français', 'Disponible', 49, 774),
(122, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9786335875600', 'français', 'Disponible', 65, 435),
(123, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1813', '9788867940418', 'français', 'Disponible', 68, 502),
(124, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9786992256878', 'français', 'Disponible', 51, 276);
INSERT INTO `book` (`livre_id`, `image_url`, `titre`, `auteur`, `editeur`, `resume`, `categorie`, `annee`, `isbn`, `langue`, `statut`, `bibliotheque_id`, `pages`) VALUES
(125, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9781498147995', 'français', 'Disponible', 66, 156),
(126, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1949', '9785198235891', 'français', 'Disponible', 34, 581),
(127, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9784452496849', 'français', 'Disponible', 45, 505),
(128, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9785829546081', 'français', 'Disponible', 59, 493),
(129, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1944', '9786442039751', 'français', 'Disponible', 47, 148),
(130, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9787189655823', 'français', 'Disponible', 54, 396),
(131, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1925', '9785691951193', 'français', 'Disponible', 57, 138),
(132, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9789233608159', 'français', 'Disponible', 34, 322),
(133, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9785402388726', 'français', 'Disponible', 62, 797),
(134, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9782834951564', 'français', 'Disponible', 68, 445),
(135, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9784510320307', 'français', 'Disponible', 53, 411),
(136, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1813', '9784647292202', 'français', 'Disponible', 71, 248),
(137, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9787726899086', 'français', 'Disponible', 55, 507),
(138, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9782814676786', 'français', 'Disponible', 17, 684),
(139, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1949', '9786065859622', 'français', 'Disponible', 55, 634),
(140, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9787835771448', 'français', 'Disponible', 58, 456),
(141, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9787400895346', 'français', 'Disponible', 35, 685),
(142, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9786946037337', 'français', 'Disponible', 24, 550),
(143, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9783134258647', 'français', 'Disponible', 59, 640),
(144, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1949', '9781720946244', 'français', 'Disponible', 60, 245),
(145, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9789436125010', 'français', 'Disponible', 6, 414),
(146, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1949', '9782539549527', 'français', 'Disponible', 34, 469),
(147, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1901', '9781046175818', 'français', 'Disponible', 33, 470),
(148, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1887', '9784882364083', 'français', 'Disponible', 34, 519),
(149, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1914', '9788908496585', 'français', 'Disponible', 19, 282),
(150, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9786927831527', 'français', 'Disponible', 46, 679),
(151, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9785975245369', 'français', 'Disponible', 71, 621),
(152, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9787197980014', 'français', 'Disponible', 39, 391),
(153, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9783613595359', 'français', 'Disponible', 57, 428),
(154, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9782629948466', 'français', 'Disponible', 68, 414),
(155, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9785936711978', 'français', 'Disponible', 43, 795),
(156, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9782159533546', 'français', 'Disponible', 40, 275),
(157, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9786733212920', 'français', 'Disponible', 24, 374),
(158, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9789478723495', 'français', 'Disponible', 39, 313),
(159, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1949', '9782837365752', 'français', 'Disponible', 6, 497),
(160, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '2002', '9788812427605', 'français', 'Disponible', 49, 191),
(161, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1933', '9781635866863', 'français', 'Disponible', 44, 561),
(162, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1948', '9786177053372', 'français', 'Disponible', 14, 330),
(163, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9783432264785', 'français', 'Disponible', 13, 593),
(164, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9786743650239', 'français', 'Disponible', 3, 382),
(165, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9786391233867', 'français', 'Disponible', 40, 205),
(166, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9783257150266', 'français', 'Disponible', 24, 659),
(167, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9784133347126', 'français', 'Disponible', 20, 264),
(168, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9784206544494', 'français', 'Disponible', 40, 378),
(169, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9788422856054', 'français', 'Disponible', 36, 730),
(170, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9786360739177', 'français', 'Disponible', 41, 780),
(171, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9784806409348', 'français', 'Disponible', 73, 456),
(172, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9788761831093', 'français', 'Disponible', 11, 219),
(173, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1949', '9789987807286', 'français', 'Disponible', 74, 415),
(174, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9785326378279', 'français', 'Disponible', 67, 166),
(175, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1925', '9782173545412', 'français', 'Disponible', 48, 373),
(176, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1859', '9783525485838', 'français', 'Disponible', 1, 502),
(177, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1903', '9783222882903', 'français', 'Disponible', 49, 578),
(178, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1979', '9784636757156', 'français', 'Disponible', 27, 653),
(179, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9782796306712', 'français', 'Disponible', 45, 264),
(180, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9788751762467', 'français', 'Disponible', 59, 535),
(181, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9782049312718', 'français', 'Disponible', 61, 691),
(182, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9789081655892', 'français', 'Disponible', 51, 422),
(183, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9787781428818', 'français', 'Disponible', 64, 581),
(184, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1925', '9781996504260', 'français', 'Disponible', 49, 444),
(185, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9783208149979', 'français', 'Disponible', 71, 155),
(186, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9786953136090', 'français', 'Disponible', 8, 246),
(187, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9787790059224', 'français', 'Disponible', 19, 659),
(188, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9785726385790', 'français', 'Disponible', 53, 471),
(189, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9783857747267', 'français', 'Disponible', 53, 170),
(190, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9784976672521', 'français', 'Disponible', 35, 360),
(191, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1870', '9784295021800', 'français', 'Disponible', 49, 360),
(192, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9783349301816', 'français', 'Disponible', 24, 174),
(193, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9787354650569', 'français', 'Disponible', 30, 637),
(194, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9782109470491', 'français', 'Disponible', 60, 769),
(195, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1949', '9789924461573', 'français', 'Disponible', 69, 552),
(196, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9789297623813', 'français', 'Disponible', 9, 155),
(197, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1949', '9781744378856', 'français', 'Disponible', 35, 392),
(198, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1936', '9788690452725', 'français', 'Disponible', 48, 682),
(199, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '2004', '9783047787775', 'français', 'Disponible', 19, 477),
(200, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1867', '9783631255668', 'français', 'Disponible', 15, 260),
(201, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9787859389529', 'français', 'Disponible', 18, 479),
(202, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1925', '9786420089669', 'français', 'Disponible', 45, 515),
(203, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1863', '9787128121620', 'français', 'Disponible', 53, 573),
(204, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1971', '9788768136167', 'français', 'Disponible', 66, 125),
(205, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1948', '9783680431231', 'français', 'Disponible', 71, 192),
(206, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9781725246378', 'français', 'Disponible', 51, 451),
(207, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1949', '9781641478631', 'français', 'Disponible', 47, 454),
(208, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1918', '9789700160993', 'français', 'Disponible', 51, 545),
(209, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9785433660191', 'français', 'Disponible', 32, 700),
(210, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9789691910431', 'français', 'Disponible', 32, 520),
(211, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9782670015003', 'français', 'Disponible', 72, 723),
(212, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9784211288871', 'français', 'Disponible', 18, 446),
(213, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1972', '9786517096782', 'français', 'Disponible', 5, 242),
(214, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1975', '9787544985101', 'français', 'Disponible', 26, 227),
(215, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9787298729086', 'français', 'Disponible', 72, 749),
(216, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9783173367680', 'français', 'Disponible', 12, 293),
(217, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1949', '9783215434038', 'français', 'Disponible', 30, 434),
(218, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9788223194821', 'français', 'Disponible', 65, 541),
(219, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9785922761178', 'français', 'Disponible', 9, 591),
(220, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9785512357143', 'français', 'Disponible', 60, 658),
(221, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1881', '9789930202112', 'français', 'Disponible', 45, 406),
(222, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9781822586512', 'français', 'Disponible', 3, 636),
(223, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9783697523812', 'français', 'Disponible', 32, 761),
(224, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1813', '9783102216155', 'français', 'Disponible', 68, 503),
(225, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9783826554521', 'français', 'Disponible', 70, 524),
(226, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1925', '9786019011031', 'français', 'Disponible', 61, 133),
(227, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '2017', '9781059315207', 'français', 'Disponible', 68, 126),
(228, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1937', '9789109564011', 'français', 'Disponible', 40, 722),
(229, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1936', '9786354228594', 'français', 'Disponible', 19, 194),
(230, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9788983102082', 'français', 'Disponible', 14, 759),
(231, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9784505386770', 'français', 'Disponible', 70, 199),
(232, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Adapté plusieurs fois au cinéma et salué par la critique.', 'Fantasy', '1953', '9788637722369', 'français', 'Disponible', 71, 784),
(233, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9785703996113', 'français', 'Disponible', 20, 333),
(234, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1813', '9788618528789', 'français', 'Disponible', 12, 425),
(235, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1889', '9788420893258', 'français', 'Disponible', 17, 231),
(236, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9788925160989', 'français', 'Disponible', 33, 645),
(237, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9782534271125', 'français', 'Disponible', 61, 674),
(238, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9787105396056', 'français', 'Disponible', 71, 538),
(239, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1949', '9781419464226', 'français', 'Disponible', 71, 537),
(240, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9784995907684', 'français', 'Disponible', 67, 186),
(241, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9786820569774', 'français', 'Disponible', 14, 788),
(242, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9784191624756', 'français', 'Disponible', 69, 279),
(243, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9782384062553', 'français', 'Disponible', 38, 199),
(244, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '2018', '9788680270909', 'français', 'Disponible', 50, 354),
(245, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1917', '9784584242661', 'français', 'Disponible', 13, 379),
(246, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9788453605032', 'français', 'Disponible', 31, 376),
(247, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1949', '9786836285775', 'français', 'Disponible', 65, 106);
INSERT INTO `book` (`livre_id`, `image_url`, `titre`, `auteur`, `editeur`, `resume`, `categorie`, `annee`, `isbn`, `langue`, `statut`, `bibliotheque_id`, `pages`) VALUES
(248, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1874', '9787089437696', 'français', 'Disponible', 3, 478),
(249, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1942', '9786762080741', 'français', 'Disponible', 62, 606),
(250, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9789995381649', 'français', 'Disponible', 28, 327),
(251, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9784882602618', 'français', 'Disponible', 15, 184),
(252, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9781701273231', 'français', 'Disponible', 37, 345),
(253, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9789886728917', 'français', 'Disponible', 17, 701),
(254, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1925', '9782650501887', 'français', 'Disponible', 31, 513),
(255, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1925', '9785204967816', 'français', 'Disponible', 30, 742),
(256, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9783168104252', 'français', 'Disponible', 22, 432),
(257, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9781206757412', 'français', 'Disponible', 58, 569),
(258, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Adapté plusieurs fois au cinéma et salué par la critique.', 'Science-fiction', '1949', '9784332332080', 'français', 'Disponible', 30, 407),
(259, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9785292402245', 'français', 'Disponible', 70, 457),
(260, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1813', '9782643348384', 'français', 'Disponible', 17, 164),
(261, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Adapté plusieurs fois au cinéma et salué par la critique.', 'Littérature classique', '1925', '9786905993394', 'français', 'Disponible', 45, 641),
(262, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9781764207425', 'français', 'Disponible', 9, 461),
(263, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1945', '9782724555270', 'français', 'Disponible', 57, 303),
(264, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1907', '9789547558675', 'français', 'Disponible', 74, 642),
(265, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Science-fiction', '1949', '9789213075551', 'français', 'Disponible', 2, 604),
(266, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1949', '9782119579140', 'français', 'Disponible', 69, 784),
(267, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1996', '9783352719744', 'français', 'Disponible', 45, 449),
(268, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9781055308941', 'français', 'Disponible', 37, 702),
(269, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1925', '9785390780118', 'français', 'Disponible', 5, 156),
(270, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9784734019326', 'français', 'Disponible', 27, 200),
(271, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1813', '9784184076097', 'français', 'Disponible', 58, 222),
(272, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9783296632024', 'français', 'Disponible', 43, 291),
(273, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9787216266511', 'français', 'Disponible', 72, 728),
(274, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1925', '9781787497329', 'français', 'Disponible', 22, 624),
(275, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1943', '9782836585782', 'français', 'Disponible', 67, 684),
(276, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9787246798819', 'français', 'Disponible', 37, 416),
(277, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1813', '9783953675057', 'français', 'Disponible', 25, 722),
(278, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9783483528292', 'français', 'Disponible', 42, 628),
(279, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Considéré comme un pilier de la littérature mondiale.', 'Science-fiction', '1949', '9784953194686', 'français', 'Disponible', 65, 544),
(280, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1949', '9785320523575', 'français', 'Disponible', 29, 688),
(281, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9781812934588', 'français', 'Disponible', 43, 724),
(282, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1813', '9784409062451', 'français', 'Disponible', 68, 593),
(283, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1882', '9786892262100', 'français', 'Disponible', 52, 755),
(284, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Considéré comme un pilier de la littérature mondiale.', 'Roman d\'amour', '1813', '9785315973098', 'français', 'Disponible', 1, 380),
(285, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Roman d\'amour', '1813', '9785363320731', 'français', 'Disponible', 64, 161),
(286, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9782518318241', 'français', 'Disponible', 47, 337),
(287, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9789798169928', 'français', 'Disponible', 74, 462),
(288, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1958', '9781460204792', 'français', 'Disponible', 20, 686),
(289, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1877', '9784910929545', 'français', 'Disponible', 19, 678),
(290, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1870', '9788261989207', 'français', 'Disponible', 69, 589),
(291, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Fantasy', '1869', '9786829973703', 'français', 'Disponible', 4, 244),
(292, 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg', 'Ne tirez pas sur l\'oiseau moqueur', 'Harper Lee', 'J.B. Lippincott & Co.', 'Un roman classique du Sud des États-Unis, explorant le racisme et la justice à travers les yeux de la jeune Scout Finch. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Littérature classique', '1884', '9782315185213', 'français', 'Disponible', 30, 595),
(293, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Considéré comme un pilier de la littérature mondiale.', 'Fantasy', '1885', '9787263529249', 'français', 'Disponible', 2, 148),
(294, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Considéré comme un pilier de la littérature mondiale.', 'Littérature classique', '1925', '9783076132714', 'français', 'Disponible', 61, 524),
(295, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9784548345170', 'français', 'Disponible', 71, 201),
(296, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg', 'Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'Gallimard Jeunesse', 'Le premier tome de la saga Harry Potter, où le jeune sorcier découvre l\'école de Poudlard et les secrets de son passé. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Fantasy', '1884', '9789903858500', 'français', 'Disponible', 46, 177),
(297, 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', 'Gatsby le Magnifique', 'F. Scott Fitzgerald', 'Charles Scribner\'s Sons', 'L\'histoire tragique de Jay Gatsby, symbole du rêve américain et de la décadence des années 1920. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Littérature classique', '1925', '9785381724527', 'français', 'Disponible', 65, 747),
(298, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Adapté plusieurs fois au cinéma et salué par la critique.', 'Roman d\'amour', '1813', '9787747336428', 'français', 'Disponible', 66, 675),
(299, 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg', 'Orgueil et préjugés', 'Jane Austen', 'T. Egerton', 'Une comédie romantique et sociale sur les mœurs et les mariages dans l\'Angleterre du XIXe siècle. Un roman bouleversant qui continue d\'émouvoir des générations de lecteurs.', 'Roman d\'amour', '1813', '9782302812914', 'français', 'Disponible', 47, 364),
(300, 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg', '1984', 'George Orwell', 'Secker & Warburg', 'Un roman d\'anticipation décrivant une société totalitaire où Big Brother surveille tout, dénonçant les dérives de la propagande et du pouvoir absolu. Une œuvre intemporelle traduite dans de nombreuses langues.', 'Science-fiction', '1949', '9782225918931', 'français', 'Disponible', 8, 472);

-- --------------------------------------------------------

--
-- Structure de la table `penalties`
--

DROP TABLE IF EXISTS `penalties`;
CREATE TABLE IF NOT EXISTS `penalties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reservation_id` int NOT NULL,
  `reason` varchar(255) NOT NULL,
  `amount` decimal(8,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by_admin_id` int NOT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `reservation_id` (`reservation_id`),
  KEY `created_by_admin_id` (`created_by_admin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `penalties`
--

INSERT INTO `penalties` (`id`, `user_id`, `reservation_id`, `reason`, `amount`, `created_at`, `created_by_admin_id`, `archived_at`) VALUES
(1, 2, 21, 'Retard de retour de livre', 0.00, '2025-10-12 00:50:55', 4, NULL),
(2, 2, 22, 'Retard de retour de livre', 2.00, '2025-10-12 00:51:11', 4, NULL),
(3, 2, 23, 'Retard de retour de livre', 2.00, '2025-10-12 00:51:16', 4, NULL),
(4, 2, 24, 'Retard de retour de livre', 2.00, '2025-10-12 00:52:48', 1, NULL),
(5, 2, 25, 'Retard de retour de livre', 0.00, '2025-10-12 00:59:22', 1, NULL),
(6, 2, 26, 'Retard de retour de livre', 0.00, '2025-10-12 01:13:28', 1, NULL),
(7, 2, 27, 'Retard de retour de livre', 0.00, '2025-10-12 01:19:38', 1, NULL),
(8, 2, 29, 'Retard de retour de livre', 0.00, '2025-10-12 01:24:45', 1, NULL);

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
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`) VALUES
(1, 'ADMIN_DASHBOARD', 'Accès au tableau de bord administrateur'),
(2, 'BOOK_MANAGE', 'Gestion des livres'),
(3, 'LIBRARY_MANAGE', 'Gestion des bibliothèques'),
(4, 'USER_MANAGE', 'Gestion des utilisateurs'),
(5, 'RESERVATION_MANAGE', NULL),
(6, 'LOAN_VIEW', 'Voir les emprunts'),
(7, 'RESERVATION_VIEW', 'Voir les réservations'),
(8, 'SYSTEM_MAINTENANCE', 'Maintenance du système'),
(9, 'BOOK_VIEW', 'Permission BOOK_VIEW'),
(10, 'BOOK_CREATE', 'Permission BOOK_CREATE'),
(11, 'BOOK_EDIT', 'Permission BOOK_EDIT'),
(12, 'BOOK_DELETE', 'Permission BOOK_DELETE'),
(13, 'BOOK_MANAGE_STATUS', 'Permission BOOK_MANAGE_STATUS'),
(14, 'LIBRARY_VIEW', 'Permission LIBRARY_VIEW'),
(15, 'LIBRARY_CREATE', 'Permission LIBRARY_CREATE'),
(16, 'LIBRARY_EDIT', 'Permission LIBRARY_EDIT'),
(17, 'LIBRARY_DELETE', 'Permission LIBRARY_DELETE'),
(18, 'USER_VIEW', 'Permission USER_VIEW'),
(19, 'USER_CREATE', 'Permission USER_CREATE'),
(20, 'USER_EDIT', 'Permission USER_EDIT'),
(21, 'USER_DELETE', 'Permission USER_DELETE'),
(22, 'USER_MANAGE_ROLES', 'Permission USER_MANAGE_ROLES'),
(23, 'RESERVATION_CREATE', 'Permission RESERVATION_CREATE'),
(24, 'LOAN_MANAGE', 'Permission LOAN_MANAGE'),
(25, 'ADMIN_LOGS', 'Permission ADMIN_LOGS'),
(26, 'ADMIN_REPORTS', 'Permission ADMIN_REPORTS');

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
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(2, 6),
(2, 7),
(2, 9),
(2, 14),
(2, 23),
(3, 5),
(3, 6),
(3, 7),
(3, 24),
(4, 6),
(4, 7),
(4, 9),
(4, 14);

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
  `status` enum('pre_reserved','borrowed','returned','expired','cancelled') NOT NULL,
  `picked_up_at` datetime DEFAULT NULL,
  `return_due_date` datetime DEFAULT NULL,
  `validated_by_admin_id` int DEFAULT NULL,
  `extension_requested` tinyint(1) DEFAULT '0',
  `extension_granted_until` datetime DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `cancellation_reason` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `book_id` (`book_id`),
  KEY `validated_by_admin_id` (`validated_by_admin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `book_id`, `reserved_at`, `due_date`, `returned_at`, `status`, `picked_up_at`, `return_due_date`, `validated_by_admin_id`, `extension_requested`, `extension_granted_until`, `cancelled_at`, `cancellation_reason`) VALUES
(1, 2, 104, '2025-10-10 23:27:02', '2025-10-13 23:27:02', NULL, 'expired', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(2, 2, 104, '2025-10-10 23:44:06', '2025-10-13 23:44:06', '2025-10-11 01:47:16', '', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(3, 2, 104, '2025-10-10 23:49:10', '2025-10-13 23:49:10', '2025-10-11 01:49:15', 'cancelled', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(4, 2, 104, '2025-10-10 23:50:23', '2025-10-13 23:50:23', '2025-10-11 01:51:53', 'cancelled', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(5, 2, 104, '2025-10-10 23:54:26', '2025-10-13 23:54:26', '2025-10-11 01:56:23', 'cancelled', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(6, 2, 1, '2025-10-10 23:56:29', '2025-10-13 23:56:29', '2025-10-11 01:56:51', 'cancelled', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(7, 2, 104, '2025-10-10 23:57:55', '2025-10-13 23:57:55', '2025-10-11 00:24:23', 'returned', '2025-10-11 00:11:38', '2025-11-10 00:11:38', 1, 0, NULL, NULL, NULL),
(8, 2, 1, '2025-10-11 00:00:37', '2025-10-14 00:00:37', NULL, 'cancelled', NULL, NULL, 1, 0, NULL, '2025-10-11 00:11:53', 'Livre endommage'),
(9, 1, 2, '2025-10-11 00:12:32', '2025-10-14 00:12:32', '2025-10-11 00:25:31', 'returned', '2025-10-11 00:25:21', '2025-11-10 00:25:21', 1, 0, NULL, NULL, NULL),
(10, 2, 172, '2025-10-11 00:13:49', '2025-10-14 00:13:49', '2025-10-11 00:25:33', 'returned', '2025-10-11 00:25:23', '2025-11-10 00:25:23', 1, 0, NULL, NULL, NULL),
(11, 1, 3, '2025-10-11 00:15:59', '2025-10-14 00:15:59', '2025-10-11 00:25:29', 'returned', '2025-10-11 00:16:30', '2025-11-10 00:16:30', 1, 0, NULL, NULL, NULL),
(12, 2, 1, '2025-10-11 00:37:39', '2025-10-14 00:37:39', '2025-10-11 10:52:27', 'returned', '2025-10-11 00:37:53', '2025-10-14 00:54:42', 1, 0, NULL, NULL, NULL),
(13, 1, 96, '2025-10-11 10:51:34', '2025-10-14 10:51:34', '2025-10-11 10:52:25', 'returned', '2025-10-11 10:52:04', '2025-11-10 10:52:04', 1, 0, NULL, NULL, NULL),
(14, 2, 1, '2025-10-11 14:14:05', '2025-10-14 14:14:05', '2025-10-11 14:14:34', 'returned', '2025-10-11 14:14:26', '2025-11-10 14:14:26', 4, 0, NULL, NULL, NULL),
(15, 2, 1, '2025-10-11 14:21:20', '2025-10-14 14:21:20', '2025-10-11 14:52:05', 'returned', '2025-10-11 14:21:55', '2025-11-10 14:21:55', 4, 0, NULL, NULL, NULL),
(16, 2, 132, '2025-10-11 14:50:33', '2025-10-14 14:50:33', '2025-10-11 16:50:46', 'cancelled', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(17, 2, 242, '2025-10-11 14:51:01', '2025-10-14 14:51:01', '2025-10-11 14:56:15', 'returned', '2025-10-11 14:51:44', '2025-11-15 14:51:44', 4, 0, '2025-11-15 14:51:44', NULL, NULL),
(18, 2, 1, '2025-10-11 22:05:51', '2025-10-14 22:05:51', '2025-10-11 22:07:05', 'returned', '2025-10-11 22:06:08', '2025-11-10 22:06:08', 4, 0, NULL, NULL, NULL),
(19, 4, 1, '2025-10-11 22:08:39', '2025-10-14 22:08:39', '2025-10-12 00:08:45', 'cancelled', NULL, NULL, NULL, 0, NULL, NULL, NULL),
(20, 2, 1, '2025-10-11 22:42:46', '2025-10-14 22:42:46', '2025-10-11 22:49:33', 'returned', '2025-10-11 22:43:05', '2025-11-10 22:43:05', 4, 0, NULL, NULL, NULL),
(21, 2, 2, '2025-09-03 22:48:17', '2025-09-06 22:48:17', '2025-10-11 22:51:06', 'returned', '2025-09-06 22:48:17', '2025-10-06 22:48:17', 1, 0, NULL, NULL, NULL),
(22, 2, 1, '2025-09-03 22:50:23', '2025-09-06 22:50:23', '2025-10-11 22:51:13', 'returned', '2025-09-06 22:50:23', '2025-10-06 22:50:23', 1, 0, NULL, NULL, NULL),
(23, 2, 3, '2025-09-03 22:50:30', '2025-09-06 22:50:30', '2025-10-11 22:51:18', 'returned', '2025-09-06 22:50:30', '2025-10-06 22:50:30', 1, 0, NULL, NULL, NULL),
(24, 2, 1, '2025-09-03 22:52:31', '2025-09-06 22:52:31', '2025-10-11 22:52:50', 'returned', '2025-09-06 22:52:31', '2025-10-06 22:52:31', 1, 0, NULL, NULL, NULL),
(25, 2, 1, '2025-09-03 22:58:35', '2025-09-06 22:58:35', '2025-10-11 23:13:09', 'returned', '2025-09-06 22:58:35', '2025-10-06 22:58:35', 1, 0, NULL, NULL, NULL),
(26, 2, 1, '2025-09-03 23:13:21', '2025-09-06 23:13:21', '2025-10-11 23:13:38', 'returned', '2025-09-06 23:13:21', '2025-10-06 23:13:21', 1, 0, NULL, NULL, NULL),
(27, 2, 1, '2025-09-03 23:19:30', '2025-09-06 23:19:30', '2025-10-11 23:24:18', 'returned', '2025-09-06 23:19:30', '2025-10-06 23:19:30', 1, 0, NULL, NULL, NULL),
(28, 2, 1, '2025-09-03 23:24:26', '2025-09-06 23:24:26', '2025-10-11 23:31:54', 'returned', '2025-09-06 23:24:26', '2025-10-06 23:24:26', 1, 0, NULL, NULL, NULL),
(29, 2, 2, '2025-09-03 23:24:39', '2025-09-06 23:24:39', '2025-10-11 23:31:56', 'returned', '2025-09-06 23:24:39', '2025-10-06 23:24:39', 1, 0, NULL, NULL, NULL),
(30, 1, 1, '2025-10-11 23:32:21', '2025-10-14 23:32:21', '2025-10-11 23:37:44', 'returned', '2025-10-11 23:32:30', '2025-10-10 23:32:30', 1, 0, NULL, NULL, NULL);

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrateur'),
(2, 'user', NULL),
(3, 'employe_bibliotheque', 'Rôle correspondant aux simple employés de bibliothèque'),
(4, 'user_sanctioned', 'Utilisateur sanctionné');

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
(1, 2),
(2, 4),
(4, 2),
(4, 3);

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `created_at`) VALUES
(1, 'admin', 'scrypt:32768:8:1$lOTs0KqEMPdrIUrN$4958e4c03f27d1f93d64a9376447bd340cacd7f5ecc57f1df15a08e89c0cf90183ed1b7153009d7490cd133bce3cb7eb455e598fbeb5014a2243231c8f934e6f', 'admin@bibolib.fr', '2025-10-06 20:20:21'),
(2, 'test', 'scrypt:32768:8:1$16sUuR3HOyWraYHz$08cb22cc6167de8d18abfedfcd4c6c4f0ecf28db0622a60c518b3d8e8ff88848a22bd6b620971b4fc0079922c1fdad17443401c24822aaafdbf227eff61fb117', 'test@gmail.fr', '2025-10-06 19:00:00'),
(4, 'test2', 'scrypt:32768:8:1$IY1CUtaMSm988BfV$3a276ab8cb01389f2f420cab8ddc711a44a5257417d3730180edafc07cee5ca3e9d51bb1726b6e108ae36006f63db53a888639307b8c918c2d1173dee9b800ca', 'test2@gmail.com', '2025-10-11 14:10:21');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
