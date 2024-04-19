// @ts-nocheck
import { fail } from '@sveltejs/kit'
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { redirect } from '@sveltejs/kit';
import { load } from 'cheerio';

import league from '../../../../teams.json'
import {  updateWeeklyGameStatistics, uploadSchedule } from '$lib/stats.server';



export const actions = {
    uflPlayers: async ({ fetch, locals: { supabase }, request }) => {
       


        const options = { method: 'GET', headers: { accept: 'application/json' } };

        const { data: teams, error } = await supabase.from('ufl_teams').select('*')
        //const shortTeams = [teams[0]]
        teams.forEach(async (team) => {
            const teamPlayersJson = await fetch(`https://api.sportradar.com/ufl/trial/v7/en/teams/${team.sportradar_id}/full_roster.json?api_key=gS6VBTtL7i4Nhu3Djxf5V6wKWkjB8MfY7fGL33VC`, options)
            
            const teamPlayers = await teamPlayersJson.json()
            const players = teamPlayers.players;
            const offensivePositions = ['QB', 'RB', 'WR', 'TE', 'K']
            const offensivePlayers = players.filter(p => offensivePositions.includes(p.position))
            console.log(offensivePlayers.length)
            //remove duplicate ids 
            const noDuplicates = []
            const ids = []
            offensivePlayers.forEach(p => {
                if (!ids.includes(p.id)) {
                    noDuplicates.push(p)
                    ids.push(p.id)
                }
            })
            console.log(noDuplicates.length)

            const formattedPlayers = noDuplicates.map(p => {
                return {
                    id: p.id,
                    name: p.name,
                    number: p.jersey,
                    position: p.position,
                    college: p.college,
                    team_id: team.id,
                    //img_url: p.headshot,
                }
            })
            const { data: playersData, error } = await supabase.from('players_ids').upsert(formattedPlayers, {onConclict: 'id'})
            if (error) {
                console.log(error)
               
            }
        })
    },
    updatePlayers: async ({ locals: { supabase }, request, fetch }) => {
        //redirect if not logged in
        if (!locals.user) {
            throw redirect(303, '/')
        }
        //define url and id for xfl teams
        const teams = [
            { name: 'vipers', url: 'https://www.xfl.com/teams/las-vegas/roster', id: 1 },
            { name: 'battlehawks', url: 'https://www.xfl.com/teams/st-louis/roster', id: 2 },
            { name: 'seadragons', url: 'https://www.xfl.com/teams/seattle/roster', id: 3 },
            { name: 'brahmas', url: 'https://www.xfl.com/teams/san-antonio/roster', id: 4 },
            { name: 'guardians', url: 'https://www.xfl.com/teams/orlando/roster', id: 5 },
            { name: 'roughnecks', url: 'https://www.xfl.com/teams/houston/roster', id: 6 },
            { name: 'defenders', url: 'https://www.xfl.com/teams/washington-dc/roster', id: 7 },
            { name: 'renegades', url: 'https://www.xfl.com/teams/arlington/roster', id: 8 }]

        const offensive = ['QB', 'RB', 'WR', 'TE', 'K']

        let players = []
        //loop through teams and fetch players from the xfl website
        for (const team of teams) {
            const res = await fetch(team.url)
            const html = await res.text()
            const $ = load(html);

            //use cheerio to extract player data from html response
            $("table").each((tIndex, table) => {
                $(table)
                    .find("tr")
                    .slice(1)
                    .each((index, row) => {
                        const cells = $(row).find("td");
                        //log each cell's text


                        //check if position is offensive 
                        if (offensive.includes($(cells[3 - tIndex]).text().trim())) {
                            const number = $(cells[2 - (2 * tIndex)]).text().trim() !== "" ? $(cells[2 - (2 * tIndex)]).text().trim() : null
                            players.push({
                                name: $(cells[1]).text().trim(),
                                number: number,
                                position: $(cells[3 - tIndex]).text().trim(),
                                college: $(cells[4 - tIndex]).text().trim(),
                                team_id: team.id,
                                img_url: $(cells[0]).find('img').attr('src'),
                                id: $(cells[1]).text().trim().replace(/\s/g, '_').toLowerCase()
                            });
                        }
                    });
            });
        }
        //build new players array from players. Only add players if they don't already exist in the new players array
        let unqPlayers = []
        let duplicates = []
        for (const player of players) {
            //check if player already exists in newPlayers array
            if (!unqPlayers.find(p => p.id === player.id)) {
                unqPlayers.push(player)
            } else {
                duplicates.push(player)
            }
        }



        const { data: playersData, error } = await supabase
            .from('players')
            .insert(unqPlayers)

        if (error) {
            console.log(error)
            return fail(401, { error_message: error.message || "Something went wrong" })
        }


        return {
            message: "Inserted Players",
            duplicates: duplicates,
        }
    },
    processWaivers: async ({ }) => {
        const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        //upcoming tuesday 
        const processDate = new Date();
        processDate.setDate(processDate.getDate() + (2 + 7 - processDate.getDay()) % 7);

        const year = processDate.getFullYear();
        // Adding 1 because getMonth() returns 0-11 for Jan-Dec
        const month = (processDate.getMonth() + 1).toString().padStart(2, '0');
        const day = processDate.getDate().toString().padStart(2, '0');

        const dateString = `${month}-${day}-${year}`;


        const { data, error } = await supabase
            .from('leagues')
            .select('id, size, roster_limits, roster_size, teams(id, priority, waivers(*)) ')
            .match({ 'teams.waivers.has_processed': false })

        //remove leagues with no waivers 
        const leagues = data.filter(l => l.teams.some(t => t.waivers.length > 0))

        for (const league of leagues) {

            await processWaiversForLeague(league, supabase)
        }
    },
    updateSchedule: async ({ locals: { supabase }, request }) => {
        uploadSchedule();

    },
    gameStats: async ({ locals: { supabase }, request }) => {
        updateWeeklyGameStatistics(3);
    }
}

async function processWaiversForLeague(league, supabase) {

    //return if no waivers 
    if (!league.teams.some(t => t.waivers.length > 0)) {
        return
    }
    console.log('waivers remaining for league', league.id, league.teams.map(t => t.waivers.length).reduce((a, b) => a + b))
    // get team with lowest priority that has waivers 
    const teamsWithWaivers = league.teams.filter(t => t.waivers.length > 0)
    const nextWaiverTeam = teamsWithWaivers.reduce((a, b) => a.priority < b.priority ? a : b)
    const nextWaiver = nextWaiverTeam.waivers.reduce((a, b) => a.order < b.order ? a : b)

    //confirm team has room to add player 
    const { data: teamSizeData, error: teamSizeError } = await supabase
        .from('teams')
        .select('player_leagues(id)')
        .eq('id', nextWaiver.team_id)
        .single()

    if (teamSizeError) {
        console.log('ts error', teamSizeError)
        return
    }

    //if team is full, deny waiver 
    if (teamSizeData.player_leagues.length >= league.roster_size) {
        console.log(`team ${nextWaiver.team_id} is full, so this request is denied`)
        const { data: updateWaiver, error: updateWaiverError } = await supabase
            .from('waivers')
            .update({ has_processed: true, result: 'denied_roster_limit' })
            .eq('id', nextWaiver.id)
        processWaiversForLeague(league, supabase)
        return
    }

    //check if they're dropping someone 
    if (nextWaiver.drop_player_leagues_id) {
        //update player_leagues for player being dropped 
        console.log(`team ${nextWaiver.team_id} is dropping player ${nextWaiver.drop_player_leagues_id}`)
        const { data: dropPlayer, error: dropPlayerError } = await supabase
            .from('player_leagues')
            .update([{ team: null, rostered: false, waiver: true }])
            .eq('id', nextWaiver.drop_player_leagues_id)

        if (dropPlayerError) {
            console.log('dp error', dropPlayerError)
            return
            //processWaiversForLeague(remainingWaivers)
            //TODO handle failure case 
        }
    }



    //attempt to add player to team 
    console.log(`team ${nextWaiver.team_id} is adding player ${nextWaiver.add_player_leagues_id}`)
    const { data: addPlayerToTeam, error: newPlayerError } = await supabase
        .from('player_leagues')
        .update([{ team: nextWaiver.team_id, rostered: true, waiver: false }])
        .eq('id', nextWaiver.add_player_leagues_id)



    if (newPlayerError) {
        console.log('np error', newPlayerError)
        return
        //processWaiversForLeague(remainingWaivers)
        //TODO handle failure case 
    }
    //update waiver in db 
    const { data: updateWaiver, error: updateWaiverError } = await supabase
        .from('waivers')
        .update({ has_processed: true, result: 'approved' })
        .eq('id', nextWaiver.id)

    //delete waiver from team and update priorities
    league.teams = league.teams.map(t => {
        if (t.id === nextWaiver.team_id) {
            t.waivers = t.waivers.filter(w => w.id !== nextWaiver.id)
            t.priority = league.size
        } else {
            t.priority = t.priority - 1
        }
        return t;
    })

    //on success - remove all waivers including this player 
    //update statuses in DB 
    //get all waivers for this player
    const resolvedWaivers = []
    const waiversContainingPlayer = league.teams.map(t => {
        const teamsResolvedWaivers = t.waivers.filter(w => w.add_player_leagues_id === nextWaiver.add_player_leagues_id)
        resolvedWaivers.push(...teamsResolvedWaivers)
        t.waivers = t.waivers.filter(w => w.add_player_leagues_id !== nextWaiver.add_player_leagues_id)
        return t;
    })


    //update waivers in DB 
    const { data: updateWaivers, error: updateWaiversError } = await supabase
        .from('waivers')
        .upsert(resolvedWaivers.map(w => ({ id: w.id, has_processed: true, result: 'denied_already_claimed', league_id: league.id, add_player_leagues_id: w.add_player_leagues_id, team_id: w.team_id, process_date: w.process_date })))

    if (updateWaiversError) {
        console.log('uw error', updateWaiversError)
        return
    }

    //update priority in DB 
    const { data: updatePriority, error: updatePriorityError } = await supabase
        .from('teams')
        .upsert(league.teams.map(t => ({ id: t.id, priority: t.priority, league_id: league.id })))

    if (updatePriorityError) {
        console.log('up error', updatePriorityError)
        return
    }
    //repeat until all waivers are processed
    processWaiversForLeague(league, supabase)
}