
-- Create incident_feedback table
CREATE TABLE IF NOT EXISTS incident_feedback (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER NOT NULL REFERENCES incidents(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  resolved BOOLEAN DEFAULT TRUE
);

-- Add RLS policies for incident_feedback
ALTER TABLE incident_feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to read any feedback
CREATE POLICY "Anyone can read feedback" 
  ON incident_feedback 
  FOR SELECT 
  USING (true);

-- Allow users to create feedback
CREATE POLICY "Users can create feedback" 
  ON incident_feedback 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to update only their own feedback
CREATE POLICY "Users can update own feedback" 
  ON incident_feedback 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete only their own feedback
CREATE POLICY "Users can delete own feedback" 
  ON incident_feedback 
  FOR DELETE 
  USING (auth.uid() = user_id);
