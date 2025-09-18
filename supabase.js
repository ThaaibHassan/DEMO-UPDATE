// Initialize Supabase client with error handling
let supabase = null;

try {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not found. Database features will be disabled.');
    console.warn('   Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  } else {
    // Check if we're in a Node.js environment that supports Headers
    if (typeof Headers === 'undefined') {
      console.warn('⚠️  Headers not available in this Node.js version. Database features will be disabled.');
      console.warn('   Please upgrade to Node.js 20+ for full Supabase support.');
    } else {
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
  }
} catch (error) {
  console.warn('⚠️  Supabase initialization failed:', error.message);
  console.warn('   Database features will be disabled.');
}

// Database operations
const db = {
  // Store contact form submission
  async storeContactSubmission(data) {
    if (!supabase) {
      console.warn('Supabase not configured, skipping database storage');
      return null;
    }

    try {
      const { data: result, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            company: data.company || null,
            subject: data.subject,
            message: data.message,
            ip_address: data.ipAddress || null,
            user_agent: data.userAgent || null,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error storing contact submission:', error);
        return null;
      }

      console.log('✅ Contact submission stored in database:', result[0]?.id);
      return result[0];
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  // Get all contact submissions (for admin purposes)
  async getContactSubmissions(limit = 50, offset = 0) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching contact submissions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  // Get submission by ID
  async getContactSubmission(id) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching contact submission:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  // Mark submission as read/processed
  async markAsProcessed(id, notes = null) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          admin_notes: notes
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating contact submission:', error);
        return null;
      }

      return data[0];
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  // Get statistics
  async getStats() {
    if (!supabase) {
      console.warn('Supabase not configured');
      return { total: 0, processed: 0, pending: 0 };
    }

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('id, processed');

      if (error) {
        console.error('Error fetching stats:', error);
        return { total: 0, processed: 0, pending: 0 };
      }

      const total = data.length;
      const processed = data.filter(item => item.processed).length;
      const pending = total - processed;

      return { total, processed, pending };
    } catch (error) {
      console.error('Database error:', error);
      return { total: 0, processed: 0, pending: 0 };
    }
  }
};

module.exports = { supabase, db };
