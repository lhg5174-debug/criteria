const { createClient } = require('@supabase/supabase-js');

const url = 'https://pobrxokavekoaxyvjyvw.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Hardcoding for the script since we might not load .env.local automatically in node script without dotenv
const anonKeyHardcoded = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYnJ4b2thdmVrb2F4eXZqeXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMzMzOTAsImV4cCI6MjA4MjkwOTM5MH0.ea0gdpYjXCqKgi3VVkE5HMc_oKtzqtLcUhDbTkJsS9I';

const supabase = createClient(url, anonKeyHardcoded);

async function checkDelete() {
    console.log('--- Checking DELETE Permission ---');

    // 1. Create a test entry
    const { data, error: insertError } = await supabase
        .from('guestbook')
        .insert({ name: 'DeleteTest', message: 'To be deleted' })
        .select()
        .single();

    if (insertError) {
        console.error('Insert failed (Prereq failed):', insertError.message);
        return;
    }

    const id = data.id;
    console.log('Inserted test row ID:', id);

    // 2. Try to delete it
    const { error: deleteError } = await supabase
        .from('guestbook')
        .delete()
        .eq('id', id);

    if (deleteError) {
        console.error('[FAIL] Delete failed:', deleteError.message);
        console.error('-> Make sure you ran the SQL to add "Allow public delete access" policy.');
    } else {
        // 3. Verify it's gone (Double check, although no error usually means success or 0 rows)
        const { data: checkData } = await supabase.from('guestbook').select('*').eq('id', id);
        if (checkData.length === 0) {
            console.log('[PASS] Delete successful.');
        } else {
            console.error('[FAIL] Delete returned no error, but row still exists (RLS might be silently ignoring delete).');
        }
    }
}

checkDelete();
