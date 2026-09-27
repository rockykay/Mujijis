import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtjuntzldcwyktrwvkrc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0anVudHpsZGN3eWt0cnd2a3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MjQyNjcsImV4cCI6MjEwNTUwMDI2N30.ZndPK6ty6fgdK_jHaeBlRPLbNAk1914h3jCUGFpFAUQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('Attempting login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@test.com',
    password: 'password123'
  });
  
  if (error) {
    console.error('Error object:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('Success!', data.user.id);
  }
}

testLogin();
