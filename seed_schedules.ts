import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { addDays, format, addHours } from 'date-fns';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if(key && rest.length) acc[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {} as Record<string, string>);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const regions = [
  { id: "r1", name: "Downtown Central", zone: "Zone A", stage: 2 },
  { id: "r2", name: "Northern Heights", zone: "Zone A", stage: 4 },
  { id: "r3", name: "Riverside District", zone: "Zone B", stage: 3 },
  { id: "r4", name: "Industrial Park", zone: "Zone B", stage: 5 },
  { id: "r5", name: "Westside Gardens", zone: "Zone C", stage: 2 },
  { id: "r6", name: "Eastbrook Valley", zone: "Zone C", stage: 4 },
  { id: "r7", name: "Southgate Community", zone: "Zone D", stage: 3 },
  { id: "r8", name: "Hillcrest Area", zone: "Zone D", stage: 6 },
];

async function seed() {
  const today = new Date();
  const schedulesToInsert = [];
  
  regions.forEach((region) => {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = addDays(today, dayOffset);
      const dateStr = format(date, "yyyy-MM-dd");

      const outagesPerDay = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < outagesPerDay; i++) {
        const startHour = Math.floor(Math.random() * 20) + 2;
        const duration = Math.floor(Math.random() * 3) + 2;
        const startTime = `${String(startHour).padStart(2, "0")}:00`;
        const endTime = `${String(Math.min(startHour + duration, 23)).padStart(2, "0")}:00`;

        const scheduleStart = addHours(date, startHour);
        const scheduleEnd = addHours(date, startHour + duration);
        let status = "upcoming";

        if (scheduleEnd < today) {
          status = "completed";
        } else if (scheduleStart <= today && scheduleEnd >= today) {
          status = "active";
        }

        schedulesToInsert.push({
          region_id: region.id,
          region_name: region.name,
          start_time: startTime,
          end_time: endTime,
          date: dateStr,
          stage: Math.min(region.stage + Math.floor(Math.random() * 2), 8),
          status,
        });
      }
    }
  });

  const { error } = await supabase.from('outage_schedules').insert(schedulesToInsert);
  if (error) {
    console.error('Error inserting schedules:', error);
  } else {
    console.log(`Inserted ${schedulesToInsert.length} schedules.`);
  }
}

seed();
