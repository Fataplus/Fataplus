-- Seed data for users
INSERT INTO public.users (id, email, full_name, location, user_type, plan)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'jean.rakoto@example.com', 'Jean Rakoto', 'Antananarivo', 'farmer', 'free'),
  ('00000000-0000-0000-0000-000000000002', 'marie.andriamahefa@example.com', 'Marie Andriamahefa', 'Antsirabe', 'farmer', 'free'),
  ('00000000-0000-0000-0000-000000000003', 'rakoto.andrianarisoa@example.com', 'Rakoto Andrianarisoa', 'Toamasina', 'seller', 'free'),
  ('00000000-0000-0000-0000-000000000004', 'fara.rasoamiaramanana@example.com', 'Fara Rasoamiaramanana', 'Fianarantsoa', 'farmer', 'free'),
  ('00000000-0000-0000-0000-000000000005', 'agrisupply@example.com', 'AgriSupply', 'Antananarivo', 'seller', 'free'),
  ('00000000-0000-0000-0000-000000000006', 'techfarm@example.com', 'TechFarm', 'Toamasina', 'seller', 'free'),
  ('00000000-0000-0000-0000-000000000007', 'greengrow@example.com', 'GreenGrow', 'Ambatondrazaka', 'seller', 'free'),
  ('00000000-0000-0000-0000-000000000008', 'farmtools@example.com', 'FarmTools', 'Antsirabe', 'seller', 'free');

-- Seed data for products
INSERT INTO public.products (name, price, description, seller_id, seller_name, location, category)
VALUES
  ('Organic Rice (25kg)', 35000, 'High-quality organic rice grown in Madagascar', '00000000-0000-0000-0000-000000000001', 'Rakoto Farms', 'Antsirabe', 'Seeds'),
  ('Fertilizer (10kg)', 45000, 'Organic fertilizer for all types of crops', '00000000-0000-0000-0000-000000000005', 'AgriSupply', 'Antananarivo', 'Supplies'),
  ('Irrigation Pump', 180000, 'Efficient irrigation pump for small to medium farms', '00000000-0000-0000-0000-000000000006', 'TechFarm', 'Toamasina', 'Equipment'),
  ('Mango Seedlings (x5)', 15000, 'Healthy mango seedlings ready for planting', '00000000-0000-0000-0000-000000000007', 'GreenGrow', 'Ambatondrazaka', 'Seeds'),
  ('Hand Tools Set', 65000, 'Complete set of hand tools for farming', '00000000-0000-0000-0000-000000000008', 'FarmTools', 'Antsirabe', 'Equipment');

-- Seed data for courses
INSERT INTO public.courses (title, description, lessons, category)
VALUES
  ('Rice Cultivation Basics', 'Learn the fundamentals of rice farming in Madagascar', 8, 'Crops'),
  ('Sustainable Farming Practices', 'Eco-friendly techniques for long-term land management', 6, 'Sustainability'),
  ('Pest Management', 'Identify and control common agricultural pests', 5, 'Protection'),
  ('Water Conservation', 'Techniques to maximize water efficiency on your farm', 4, 'Sustainability');

-- Seed data for user course progress
INSERT INTO public.user_courses (user_id, course_id, completed_lessons)
VALUES
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.courses WHERE title = 'Rice Cultivation Basics'), 2),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.courses WHERE title = 'Pest Management'), 3);

-- Seed data for posts
INSERT INTO public.posts (author_id, content, post_type)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Has anyone tried the new drought-resistant rice variety? How well does it perform in our region?', 'question'),
  ('00000000-0000-0000-0000-000000000002', 'I''m selling freshly harvested avocados at the Antsirabe market this weekend. Come visit!', 'marketplace'),
  ('00000000-0000-0000-0000-000000000003', 'My tomato plants have these yellow spots. Can anyone help identify what''s causing this and how to treat it?', 'question'),
  ('00000000-0000-0000-0000-000000000004', 'Just finished installing the new irrigation system! It''s already saving us time and water.', 'general');

-- Seed data for likes
INSERT INTO public.likes (post_id, user_id)
VALUES
  ((SELECT id FROM public.posts WHERE content LIKE 'Has anyone tried%'), '00000000-0000-0000-0000-000000000002'),
  ((SELECT id FROM public.posts WHERE content LIKE 'Has anyone tried%'), '00000000-0000-0000-0000-000000000003'),
  ((SELECT id FROM public.posts WHERE content LIKE 'Has anyone tried%'), '00000000-0000-0000-0000-000000000004'),
  ((SELECT id FROM public.posts WHERE content LIKE 'I''m selling freshly%'), '00000000-0000-0000-0000-000000000001'),
  ((SELECT id FROM public.posts WHERE content LIKE 'I''m selling freshly%'), '00000000-0000-0000-0000-000000000003'),
  ((SELECT id FROM public.posts WHERE content LIKE 'I''m selling freshly%'), '00000000-0000-0000-0000-000000000004'),
  ((SELECT id FROM public.posts WHERE content LIKE 'My tomato plants%'), '00000000-0000-0000-0000-000000000001'),
  ((SELECT id FROM public.posts WHERE content LIKE 'My tomato plants%'), '00000000-0000-0000-0000-000000000002'),
  ((SELECT id FROM public.posts WHERE content LIKE 'Just finished%'), '00000000-0000-0000-0000-000000000001'),
  ((SELECT id FROM public.posts WHERE content LIKE 'Just finished%'), '00000000-0000-0000-0000-000000000002'),
  ((SELECT id FROM public.posts WHERE content LIKE 'Just finished%'), '00000000-0000-0000-0000-000000000003');

-- Seed data for comments
INSERT INTO public.comments (post_id, author_id, content)
VALUES
  ((SELECT id FROM public.posts WHERE content LIKE 'Has anyone tried%'), '00000000-0000-0000-0000-000000000002', 'I tried it last season. It performed well even with less rainfall.'),
  ((SELECT id FROM public.posts WHERE content LIKE 'Has anyone tried%'), '00000000-0000-0000-0000-000000000003', 'It''s good but requires specific fertilizers for best results.'),
  ((SELECT id FROM public.posts WHERE content LIKE 'I''m selling freshly%'), '00000000-0000-0000-0000-000000000001', 'What''s the price per kilo?'),
  ((SELECT id FROM public.posts WHERE content LIKE 'I''m selling freshly%'), '00000000-0000-0000-0000-000000000004', 'Will you be there on Sunday as well?'),
  ((SELECT id FROM public.posts WHERE content LIKE 'My tomato plants%'), '00000000-0000-0000-0000-000000000001', 'Looks like early blight. Try neem oil spray.'),
  ((SELECT id FROM public.posts WHERE content LIKE 'My tomato plants%'), '00000000-0000-0000-0000-000000000002', 'Make sure to remove affected leaves and improve air circulation.'),
  ((SELECT id FROM public.posts WHERE content LIKE 'Just finished%'), '00000000-0000-0000-0000-000000000001', 'Which system did you install? I''m looking for one too.');

-- Seed data for cart items
INSERT INTO public.cart_items (user_id, product_id, quantity)
VALUES
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.products WHERE name = 'Fertilizer (10kg)'), 2),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.products WHERE name = 'Hand Tools Set'), 1);
