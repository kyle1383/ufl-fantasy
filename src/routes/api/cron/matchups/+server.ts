import { updateWeeklyGameStatistics } from '$lib/stats.server.js';
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
export async function GET(req) {
    //this should run about 50 x per game 
    //check if the time is between 1230 and 3 or 7 and 10 ET
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const activeGame = isGameActive();
    console.log('activeGame', activeGame)
    /* if (activeGame) {*/
    const { data: season, error: seasonError } = await supabase.from('seasons').select('*').eq('year', 2024).single()
    const week = season.week
    //await updateWeeklyGameStatistics(week || 4)
    /*}*/
    return new Response('Updated Statistics');

}

function isGameActive(): boolean {
    // Create a new date object for the current time
    const now = new Date();

    // Convert local time to Eastern Time (ET)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const et = new Date(utc - (5 * 3600000)); // Eastern Standard Time offset from UTC (-5 hours)

    // Check for Daylight Saving Time in Eastern Time
    const month = et.getMonth() + 1; // Get month (1-12)
    const day = et.getDate(); // Get day of the month
    const dayOfWeek = et.getDay(); // Day of week, 0-6, Sun-Sat

    // Determine if ET is currently observing DST
    const isDST = (month > 3 && month < 11) || // DST is generally from the second Sunday in March to the first Sunday in November
        (month === 3 && (day - dayOfWeek) >= 8) ||
        (month === 11 && (day - dayOfWeek) <= 0);

    // Adjust time if currently in DST
    if (isDST) {
        et.setHours(et.getHours() + 1);
    }

    // Get hours and minutes from the adjusted time
    const hours = et.getHours();
    const minutes = et.getMinutes();

    // Define time ranges
    const startMorning = 12.5; // 12:30 PM ET
    const endMorning = 15; // 3:00 PM ET
    const startEvening = 19; // 7:00 PM ET
    const endEvening = 22; // 10:00 PM ET

    // Calculate current time in decimal to compare
    const currentTime = hours + minutes / 60;

    // Check if current time is within the morning or evening ranges
    if ((currentTime >= startMorning && currentTime <= endMorning) ||
        (currentTime >= startEvening && currentTime <= endEvening)) {
        return true;
    }
    return false;
}