const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if(key && rest.length) acc[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('outage_schedules').select('*');
  console.log('COUNT:', data ? data.length : 'error', error);
  if (data && data.length === 0) {
    console.log('No schedules found. We might need to generate them.');
  }
}
check();
