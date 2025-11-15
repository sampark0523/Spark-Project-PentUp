-- Add user_email column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Add an index on user_email for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_user_email ON messages(user_email);

-- Add a comment describing the column
COMMENT ON COLUMN messages.user_email IS 'Email address of the authenticated UPenn user who created this message';
