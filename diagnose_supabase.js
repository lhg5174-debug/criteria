const { createClient } = require('@supabase/supabase-js');

const url = 'https://pobrxokavekoaxyvjyvw.supabase.co';
// Using Service Role Key to bypass RLS and check for existence
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYnJ4b2thdmVrb2F4eXZqeXZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzMzMzM5MCwiZXhwIjoyMDgyOTA5MzkwfQ.8QXX25WFCAzRgwdOmr-hpZjGsDon4pullMtKW639qzQ';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYnJ4b2thdmVrb2F4eXZqeXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMzMzOTAsImV4cCI6MjA4MjkwOTM5MH0.ea0gdpYjXCqKgi3VVkE5HMc_oKtzqtLcUhDbTkJsS9I';

const supabaseAdmin = createClient(url, serviceKey);
const supabaseAnon = createClient(url, anonKey);

async function diagnose() {
    console.log('--- Diagnosing Supabase Connection ---');

    // 1. Check Table Existence (using Admin)
    console.log('1. Checking if table "guestbook" exists (via Select with Service Role)...');
    const { data: adminData, error: adminError } = await supabaseAdmin
        .from('guestbook')
        .select('*')
        .limit(1);

    if (adminError) {
        console.error('   [FAIL] Table Access Error (Admin):', adminError.message);
        if (adminError.code === '42P01') {
            console.error('   -> CONCLUSION: The table "guestbook" DOES NOT EXIST. You need to run the SQL migration.');
        }
        return;
    }
    console.log('   [PASS] Table exists.');

    // 2. Check Insert Permission (using Anon)
    console.log('2. Checking Insert Permission (via Anon key)...');
    const { error: anonInsertError } = await supabaseAnon
        .from('guestbook')
        .insert([{ name: 'Diagnostic', message: 'Test entry' }]);

    if (anonInsertError) {
        console.error('   [FAIL] Insert Error (Anon):', anonInsertError.message);
        console.error('   -> CONCLUSION: RLS Policy Issue. The table exists, but anonymous users cannot insert.');
        return;
    }
    console.log('   [PASS] Insert successful.');
    console.log('--- Diagnosis Complete: System seems healthy (or we just created a test row) ---');
}

diagnose();
