-- Restore database to match the repository schema
-- This removes all changes made during the anonymous auth session

-- Drop the user_id column from messages (if it exists)
ALTER TABLE messages DROP COLUMN IF EXISTS user_id;

-- Drop the users table (if it exists)
DROP TABLE IF EXISTS users CASCADE;

-- Drop the login_requests table (if it exists)
DROP TABLE IF EXISTS login_requests CASCADE;

-- Ensure the messages table has the correct columns from the repo
ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- Ensure the correct indexes exist
CREATE INDEX IF NOT EXISTS idx_messages_user_email ON messages(user_email);
CREATE INDEX IF NOT EXISTS idx_messages_approved ON messages(approved);

-- Add comments
COMMENT ON COLUMN messages.user_email IS 'Email address of the authenticated UPenn user who created this message';
COMMENT ON COLUMN messages.approved IS 'Whether the message has been approved for display. NULL or false means pending approval.';
