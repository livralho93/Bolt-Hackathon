/*
  # Initial AI Itinerary Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `phone` (text, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `trips`
      - `id` (uuid, primary key)
      - `name` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `image_url` (text, nullable)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `trip_participants`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, references trips)
      - `user_id` (uuid, references profiles)
      - `start_date` (date, nullable - participant's custom dates)
      - `end_date` (date, nullable - participant's custom dates)
      - `role` (enum: owner, participant)
      - `joined_at` (timestamp)
    
    - `line_items`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, references trips)
      - `category` (enum: accommodation, activity, meal)
      - `title` (text)
      - `description` (text, nullable)
      - `date` (date, nullable)
      - `location` (text, nullable)
      - `cost` (decimal, nullable)
      - `assigned_to` (uuid, references profiles, nullable)
      - `created_by` (uuid, references profiles)
      - `order_index` (integer, for sorting within category)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `line_item_participants`
      - `id` (uuid, primary key)
      - `line_item_id` (uuid, references line_items)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `trip_invites`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, references trips)
      - `email` (text)
      - `token` (text, unique)
      - `expires_at` (timestamp)
      - `used_at` (timestamp, nullable)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for trip participants to access trip data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  image_url text,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trip_participants table
CREATE TABLE IF NOT EXISTS trip_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date date,
  end_date date,
  role text CHECK (role IN ('owner', 'participant')) DEFAULT 'participant',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- Create line_items table
CREATE TABLE IF NOT EXISTS line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  category text CHECK (category IN ('accommodation', 'activity', 'meal')) NOT NULL,
  title text NOT NULL,
  description text,
  date date,
  location text,
  cost decimal(10,2),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create line_item_participants table
CREATE TABLE IF NOT EXISTS line_item_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_item_id uuid REFERENCES line_items(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(line_item_id, user_id)
);

-- Create trip_invites table
CREATE TABLE IF NOT EXISTS trip_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_item_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_invites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can read trips they participate in"
  ON trips
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = trips.id
      AND trip_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Trip owners can update trips"
  ON trips
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = trips.id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.role = 'owner'
    )
  );

-- Trip participants policies
CREATE POLICY "Users can read trip participants for their trips"
  ON trip_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants tp
      WHERE tp.trip_id = trip_participants.trip_id
      AND tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip owners can manage participants"
  ON trip_participants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants tp
      WHERE tp.trip_id = trip_participants.trip_id
      AND tp.user_id = auth.uid()
      AND tp.role = 'owner'
    )
  );

CREATE POLICY "Users can update their own participation"
  ON trip_participants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Line items policies
CREATE POLICY "Users can read line items for their trips"
  ON line_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = line_items.trip_id
      AND trip_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip participants can manage line items"
  ON line_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = line_items.trip_id
      AND trip_participants.user_id = auth.uid()
    )
  );

-- Line item participants policies
CREATE POLICY "Users can read line item participants for their trips"
  ON line_item_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM line_items li
      JOIN trip_participants tp ON tp.trip_id = li.trip_id
      WHERE li.id = line_item_participants.line_item_id
      AND tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip participants can manage line item participants"
  ON line_item_participants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM line_items li
      JOIN trip_participants tp ON tp.trip_id = li.trip_id
      WHERE li.id = line_item_participants.line_item_id
      AND tp.user_id = auth.uid()
    )
  );

-- Trip invites policies
CREATE POLICY "Users can read invites for their trips"
  ON trip_invites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = trip_invites.trip_id
      AND trip_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Trip owners can manage invites"
  ON trip_invites
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trip_participants
      WHERE trip_participants.trip_id = trip_invites.trip_id
      AND trip_participants.user_id = auth.uid()
      AND trip_participants.role = 'owner'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_participants_trip_id ON trip_participants(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_participants_user_id ON trip_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_line_items_trip_id ON line_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_line_items_category ON line_items(category);
CREATE INDEX IF NOT EXISTS idx_line_item_participants_line_item_id ON line_item_participants(line_item_id);
CREATE INDEX IF NOT EXISTS idx_trip_invites_token ON trip_invites(token);
CREATE INDEX IF NOT EXISTS idx_trip_invites_email ON trip_invites(email);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_line_items_updated_at
  BEFORE UPDATE ON line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();