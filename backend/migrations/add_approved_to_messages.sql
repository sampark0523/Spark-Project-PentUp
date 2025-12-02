-- Add approved column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- Add an index on approved for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_approved ON messages(approved);

-- Add a comment describing the column
COMMENT ON COLUMN messages.approved IS 'Whether the message has been approved for display. NULL or false means pending approval.';

