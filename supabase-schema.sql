-- Blackwater Industries Contact Form Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(100),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_processed ON contact_submissions(processed);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for security
-- Allow anonymous users to insert (for contact form submissions)
CREATE POLICY "Allow anonymous contact form submissions" ON contact_submissions
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Allow authenticated users to read all submissions (for admin dashboard)
CREATE POLICY "Allow authenticated users to read submissions" ON contact_submissions
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Allow authenticated users to update submissions (for marking as processed)
CREATE POLICY "Allow authenticated users to update submissions" ON contact_submissions
    FOR UPDATE 
    TO authenticated 
    USING (true);

-- Create a view for easy querying
CREATE OR REPLACE VIEW contact_submissions_summary AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    company,
    subject,
    processed,
    created_at,
    CASE 
        WHEN processed THEN 'Processed'
        ELSE 'Pending'
    END as status
FROM contact_submissions
ORDER BY created_at DESC;

-- Grant permissions on the view
GRANT SELECT ON contact_submissions_summary TO authenticated;
GRANT SELECT ON contact_submissions_summary TO anon;

-- Insert some sample data (optional - remove in production)
-- INSERT INTO contact_submissions (first_name, last_name, email, company, subject, message) VALUES
-- ('John', 'Doe', 'john@example.com', 'Acme Corp', 'Consultation Request', 'I would like to discuss our strategic planning needs.'),
-- ('Jane', 'Smith', 'jane@techstartup.com', 'TechStartup Inc', 'Partnership Inquiry', 'We are interested in exploring a partnership opportunity.');

-- Create a function to get submission statistics
CREATE OR REPLACE FUNCTION get_contact_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(*),
        'processed', COUNT(*) FILTER (WHERE processed = true),
        'pending', COUNT(*) FILTER (WHERE processed = false),
        'this_month', COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW())),
        'last_7_days', COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')
    ) INTO result
    FROM contact_submissions;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_contact_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_contact_stats() TO anon;
