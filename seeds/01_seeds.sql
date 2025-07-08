-- Insert Users
INSERT INTO users (name, email, password)
VALUES 
  ("Naomi Tanaka", "naomi.tanaka@hotmail.com", "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u."),
  ("Lie Mirai", "lie.mirai@hotmail.com", "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u."),
  ("Moa Blue", "moa.blue@outlook.com", "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.");

-- Insert Properties
INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
  country, street, city, province, post_code, active
)
VALUES 
  (
    1,
    "Speed Lamp",
    "Modern guesthouse with smart lighting and minimalist decor. Perfect for couples.",
    "https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350",
    "https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg",
    93061, 6, 4, 8, "Canada", "536 Namsub Highway", "Sotboske", "Quebec", "28142", true
  ),
  (
    1,
    "Blank Corner",
    "Spacious home with open-concept design and a cozy reading nook in the corner.",
    "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350",
    "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg",
    85234, 6, 6, 7, "Canada", "651 Nami Road", "Bohbatev", "Alberta", "83680", true
  ),
  (
    2,
    "Habit Mix",
    "Eco-friendly loft designed for digital nomads. Fast Wi-Fi and nature views.",
    "https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350",
    "https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg",
    46058, 0, 5, 6, "Canada", "1650 Hejto Center", "Genwezuj", "Newfoundland And Labrador", "44583", true
  );

-- Insert Reservations
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES 
  ("2018-09-11", "2018-09-26", 2, 3),
  ("2019-01-04", "2019-02-01", 2, 2),
  ("2023-10-01", "2023-10-14", 1, 3);

-- Insert Property Reviews
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES 
  (3, 2, 1, 3, "the bedroom is too narrow."),
  (2, 2, 2, 4, "good location."),
  (3, 1, 3, 4, "family friedly structure & close to schools.");

