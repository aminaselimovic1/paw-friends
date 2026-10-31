-- PawFriends database: the 6 tables from docs/ERD.md and their sample data.
--
-- Import this file in phpMyAdmin (Import tab) or with:
--   /Applications/XAMPP/bin/mysql -u root < backend/database/pawfriends.sql
-- Importing it again deletes the tables and creates them again with only the
-- sample data.
--
-- Foreign keys use ON DELETE RESTRICT: MySQL refuses to delete a row that
-- other rows still point to (a shelter with pets, a pet with applications or
-- health records, a user with applications or records). The admin pages
-- explain the same rule to the admin.

CREATE DATABASE IF NOT EXISTS paw_friends
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE paw_friends;

-- Children first: a table can't be dropped while another table points to it
DROP TABLE IF EXISTS vaccinations;
DROP TABLE IF EXISTS vet_records;
DROP TABLE IF EXISTS adoption_applications;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS shelters;
DROP TABLE IF EXISTS users;

-- Everyone who logs in. Vets and admins are users with another role.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'vet', 'user') NOT NULL DEFAULT 'user',
    phone VARCHAR(50),
    city VARCHAR(100)
);

CREATE TABLE shelters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    opening_hours TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shelter_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    species ENUM('dog', 'cat') NOT NULL,
    breed_name VARCHAR(100) NOT NULL,
    breed_api_id VARCHAR(20),
    sex ENUM('male', 'female') NOT NULL,
    birth_date DATE NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    status ENUM('available', 'pending', 'adopted') NOT NULL DEFAULT 'available',
    FOREIGN KEY (shelter_id) REFERENCES shelters(id) ON DELETE RESTRICT
);

-- reviewed_by is the admin who approved or rejected; empty while pending
CREATE TABLE adoption_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    reviewed_by INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE vet_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    vet_id INT NOT NULL,
    visit_date DATE NOT NULL,
    reason VARCHAR(150) NOT NULL,
    diagnosis VARCHAR(255),
    treatment VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE RESTRICT,
    FOREIGN KEY (vet_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE vaccinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    vet_id INT NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    date_given DATE NOT NULL,
    next_due_date DATE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE RESTRICT,
    FOREIGN KEY (vet_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Sample data: the same records and ids as the Milestone 1 frontend, so a
-- link like #pet-details?id=1 still shows Max. Parents come first, because
-- a foreign key can only point to a row that already exists.

-- Every account's password is demo1234. Only its hash is stored, made with
-- PHP's password_hash(); at login, password_verify() checks the typed
-- password against it.
INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES
(1, 'Selma Hodžić', 'admin@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'admin', '+387 33 111 222', 'Sarajevo'),
(2, 'Emina Mehić', 'emina.vet@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'vet', '+387 61 222 333', 'Sarajevo'),
(3, 'Amar Hadžić', 'amar@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'user', NULL, NULL),
(4, 'Adnan Begić', 'adnan.vet@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'vet', NULL, NULL),
(5, 'Sara Kovačević', 'sara@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'user', NULL, NULL),
(6, 'Tarik Delić', 'tarik@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'user', NULL, NULL),
(7, 'Lejla Kovač', 'lejla@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'user', '+387 61 123 456', 'Sarajevo'),
(8, 'Ivana Marić', 'ivana@example.com', '$2y$10$K3tUbnSZgcy0oYF9l39QQeHUNakPaT2GbYuJHwMslvtQ0KDUIshZe', 'user', NULL, NULL);

-- '\n' in opening_hours is a line break (one line per group of days)
INSERT INTO shelters (id, name, address, city, phone, email, description, opening_hours, latitude, longitude) VALUES
(1, 'Happy Paws Shelter', 'Kestenova 12', 'Sarajevo', '+387 33 123 456', 'info@happypaws.example',
 'A family-run shelter that has been finding homes for dogs and cats since 2015. Our volunteers walk, feed and play with every animal each day, and we''re happy to help you find the pet that fits your home.',
 'Monday–Friday: 9:00–17:00\nSaturday: 10:00–14:00\nSunday: closed', 43.8563, 18.4131),
(2, 'Second Chance Rescue', 'Lipa 7', 'Mostar', '+387 36 234 567', 'hello@secondchance.example',
 'A volunteer rescue that gives abandoned animals a second chance at a happy life. We take in pets found on the streets and care for them until they find a family who will love them.',
 'Monday–Saturday: 10:00–18:00\nSunday: closed', 43.3438, 17.8078),
(3, 'Safe Haven Shelter', 'Brezova 3', 'Tuzla', '+387 35 345 678', 'contact@safehaven.example',
 'A small shelter with a big garden, where the dogs get daily walks and lots of play time. Visitors are welcome to meet the dogs and take them for a walk before deciding to adopt.',
 'Every day: 8:00–16:00', 44.5384, 18.6671),
(4, 'Whisker Haven Cat Rescue', 'Javorova 21', 'Banja Luka', '+387 51 456 789', 'cats@whiskerhaven.example',
 'A rescue for cats of all ages, from playful kittens to calm seniors looking for a quiet home. Our cats live together in bright, cosy rooms, so you can see how they get along with others.',
 NULL, 44.7722, 17.1910);

-- breed_api_id stays empty until the breed info is added in Milestone 3
INSERT INTO pets (id, shelter_id, name, species, breed_name, sex, birth_date, photo_url, status, description) VALUES
(1, 1, 'Max', 'dog', 'Labrador Retriever', 'male', '2023-06-12', 'assets/images/pet-max.jpg', 'available',
 'A friendly, energetic dog who loves long walks and playing fetch. Great with children.'),
(2, 2, 'Luna', 'cat', 'British Shorthair', 'female', '2024-03-08', 'assets/images/pet-luna.jpg', 'pending',
 'A calm, affectionate cat who enjoys quiet afternoons on the windowsill. She loves gentle brushing.'),
(3, 1, 'Rocky', 'dog', 'Beagle', 'male', '2025-05-20', 'assets/images/pet-rocky.jpg', 'pending',
 'A curious, playful young dog who follows his nose everywhere. He would love an active family.'),
(4, 2, 'Bella', 'dog', 'Golden Retriever', 'female', '2026-02-14', NULL, 'available',
 'A sweet, cuddly puppy who is learning her first commands. She gets along well with other dogs.'),
(5, 4, 'Milo', 'cat', 'Siamese', 'male', '2026-04-03', NULL, 'available',
 'A chatty little kitten full of energy. He loves chasing toys and then curling up on a warm lap.'),
(6, 3, 'Daisy', 'dog', 'Border Collie', 'female', '2021-09-05', NULL, 'available',
 'A smart, hard-working dog who needs daily exercise and games. Best with an experienced owner.'),
(7, 4, 'Oliver', 'cat', 'Maine Coon', 'male', '2017-11-22', NULL, 'available',
 'A gentle senior cat who loves naps and soft blankets. He would be happiest in a quiet home.'),
(8, 1, 'Nala', 'cat', 'Persian', 'female', '2020-07-30', NULL, 'pending',
 'A shy but loving cat who warms up quickly once she trusts you. Perfect for a calm household.'),
(9, 3, 'Charlie', 'dog', 'German Shepherd', 'male', '2017-01-10', NULL, 'pending',
 'A loyal, well-trained older dog who knows many commands. He enjoys short walks and lots of attention.'),
(10, 1, 'Mia', 'cat', 'Bengal', 'female', '2025-08-15', NULL, 'pending',
 'A playful, adventurous cat who loves climbing and exploring. She needs plenty of toys.'),
(11, 1, 'Buddy', 'dog', 'Cocker Spaniel', 'male', '2022-04-18', NULL, 'adopted',
 'A happy, gentle dog who loves everyone he meets. His tail never stops wagging.'),
(12, 4, 'Coco', 'cat', 'Ragdoll', 'female', '2026-03-01', NULL, 'adopted',
 'A fluffy, relaxed kitten who loves being held. She purrs as soon as you pick her up.');

-- reviewed_by 1 is the admin, Selma
INSERT INTO adoption_applications (id, pet_id, user_id, status, reviewed_by, created_at, message) VALUES
(1, 2, 7, 'pending', NULL, '2026-10-12', 'I work from home and have a quiet flat, which would suit a calm cat like Luna.'),
(2, 3, 7, 'pending', NULL, '2026-10-05', 'We have a garden and two children who would love to take Rocky on walks.'),
(3, 1, 7, 'rejected', 1, '2026-09-28', 'Max looks like the perfect running partner for me.'),
(4, 11, 3, 'approved', 1, '2026-08-20', 'Our family has had cocker spaniels before and we have a big garden.'),
(5, 12, 5, 'approved', 1, '2026-09-10', 'Coco would be our first cat, and we''ve prepared a cosy corner for her.'),
(6, 8, 6, 'pending', NULL, '2026-10-08', 'I live alone in a calm flat and I''m patient with shy animals.'),
(7, 9, 8, 'pending', NULL, '2026-10-10', 'I''m retired and can give Charlie short walks and lots of company.'),
(8, 10, 3, 'pending', NULL, '2026-10-14', 'Mia would have plenty of shelves to climb in our house.'),
(9, 2, 8, 'pending', NULL, '2026-10-13', NULL),
(10, 4, 6, 'rejected', 1, '2026-09-15', 'I''d like a puppy, but I work long hours.');

-- vet_id 2 is Emina, 4 is Adnan
INSERT INTO vet_records (id, pet_id, vet_id, visit_date, reason, diagnosis, treatment, notes) VALUES
(1, 1, 2, '2026-08-14', 'Yearly check-up', 'Healthy, normal weight', 'Deworming tablet', NULL),
(2, 2, 2, '2026-05-03', 'Health check on arrival at the shelter', 'Healthy', NULL, 'Calm during the examination.'),
(3, 3, 4, '2025-08-01', 'First check-up as a puppy', 'Healthy', NULL, NULL),
(4, 3, 4, '2026-09-22', 'Scratching his left ear', 'Mild ear infection', 'Ear drops twice a day for 7 days', 'Check again if it comes back.'),
(5, 5, 2, '2026-07-10', 'Kitten check-up', 'Healthy', NULL, 'Booster vaccine due in three months.'),
(6, 9, 4, '2026-09-30', 'Stiff back legs in the morning', 'Mild arthritis (age-related)', 'Joint supplement once a day', 'Short walks only.'),
(7, 4, 2, '2026-10-02', 'Puppy check-up', 'Healthy', 'Deworming tablet', NULL),
(8, 8, 2, '2026-10-12', 'Watery left eye', 'Mild conjunctivitis', 'Eye drops twice a day for 5 days', NULL);

INSERT INTO vaccinations (id, pet_id, vet_id, vaccine_name, date_given, next_due_date) VALUES
(1, 1, 2, 'Rabies', '2026-08-14', '2027-08-14'),
(2, 1, 2, 'DHPP (distemper, hepatitis, parvovirus, parainfluenza)', '2026-08-14', '2027-08-14'),
(3, 2, 2, 'FVRCP (cat flu and feline distemper)', '2026-05-03', '2027-05-03'),
(4, 3, 4, 'DHPP (distemper, hepatitis, parvovirus, parainfluenza)', '2025-08-01', NULL),
(5, 5, 2, 'FVRCP (cat flu and feline distemper)', '2026-07-10', '2026-10-10'),
(6, 4, 2, 'DHPP (distemper, hepatitis, parvovirus, parainfluenza)', '2026-07-25', '2026-10-24'),
(7, 9, 4, 'Rabies', '2025-11-05', '2026-11-05'),
(8, 6, 4, 'Rabies', '2026-03-15', '2027-03-15');
