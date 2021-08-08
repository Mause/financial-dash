import { VercelRequest, VercelResponse } from '@vercel/node';

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

export default async function(req: VercelRequest, res: VercelResponse) {
    res.json({keys: Object.keys(process.env), supabase});
}
