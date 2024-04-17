import { error } from 'console';
import { fail } from '@sveltejs/kit';
export async function load({ parent, params, locals: { getSession, supabase } }) {
    const { team } = await parent();
   
  
    const { data, error: waiverError } = await supabase
        .from('waivers')
        .select('*')
        .eq('team_id', team.id)
        .eq('has_processed', false)


    if (waiverError) {
        return error(500, waiverError)
    }
    return {
        waiver_requests: data
    }
}
export const actions = {
    add: async ({ request, params, locals: { getSession, supabase } }) => {
        const session = await getSession();
        const user = session.user;
        const formData = await request.formData();
        const add_player_id = formData.get('add_player_id');
        const drop_player = formData.get('drop_player');

        //check draft status 
        const { data: league, error: leagueError } = await supabase
            .from('leagues')
            .select('drafts(*)')
            .eq('id', params.id)
            .single()

        if(!league || league.drafts?.status === 'PREDRAFT' ||  league.drafts?.status === 'ACTIVE' ||  league.drafts?.status === 'PAUSED' || !league.drafts){
            console.log(league.draft.status)
            return fail(401, {body: 'Cannot add player until draft is complete'})
        }
      
        const { data: team, error: teamError } = await supabase
            .from('teams')
            .select('id, player_leagues(player_id, id), leagues(roster_limits)')
            .eq('manager', user.id)
            .eq('league_id', params.id)
            .single()

        if (teamError) {
            return { status: 500, body: teamError }
        }

        const rosterSize = team.player_leagues.length;
        const allowedRosterSize = Object.values(JSON.parse(team.leagues.roster_limits)).reduce((acc, cur) => acc + cur, 0);

        //confirm dropping player if team is full 
        if (rosterSize >= allowedRosterSize && !drop_player) {
            return { status: 500, body: 'Team is full' }
        }
        //confirm adding player is on waivers 
        const { data: playerToAdd, error: playerError } = await supabase
            .from('player_leagues')
            .select('id, player_id, waiver, rostered')
            .eq('player_id', add_player_id)
            .eq('league_id', params.id)
            .single()

        if (playerError) {
            return { status: 500, body: playerError }
        }
        if (playerToAdd.rostered) {
            return { status: 500, body: 'Player is already rostered' }
        }

        const playerOnTeam = team.player_leagues.find(player => player.player_id === drop_player)

        //CASE - player is !waivered and team is full 
        if (!playerToAdd.waiver && drop_player) {
            //confirm dropping player is on player's team 


            if (!playerOnTeam) {
                return { status: 500, body: 'Player not on team' }
            }
            //add new player 
            const { data: addPlayerToTeam, error: newPlayerError } = await supabase
                .from('player_leagues')
                .update([{ team: team.id, rostered: true, waiver: true }])
                .eq('player_id', add_player_id)
                .eq('league_id', params.id)


            if (newPlayerError) {
                return { status: 500, body: newPlayerError.message }
            }
            //remove old player 
            const { data: removePlayerFromTeam, error: removePlayerError } = await supabase
                .from('player_leagues')
                .update([{ team: null, rostered: false, waiver: true }])
                .eq('player_id', drop_player)
                .eq('league_id', params.id)


            if (removePlayerError) {
                return { status: 500, body: removePlayerError.message }
            }
            return { status: 200, body: 'Successfully Added Player' }
        }
        //CASE - player is !waivered and not dropping anyone
        if (!playerToAdd.waiver && !drop_player) {
            //add new player 
            const { data: addPlayerToTeam, error: newPlayerError } = await supabase
                .from('player_leagues')
                .update([{ team: team.id, rostered: true, waiver: true }])
                .eq('player_id', add_player_id)
                .eq('league_id', params.id)


            if (newPlayerError) {
                return { status: 500, body: newPlayerError.message }
            }
            return { status: 200, body: 'Successfully Added Player' }
        }

        //CASE - player is waivered and not dropping player
        if (playerToAdd.waiver && !drop_player) {
            //Next Tuesday
            const processDate = new Date();
            processDate.setDate(processDate.getDate() + (2 + 7 - processDate.getDay()) % 7);
            //create a waiver 

            const { data: createWaiver, error: waiverError } = await supabase
                .from('waivers')
                .insert([{ league_id: params.id, add_player_leagues_id: playerToAdd.id,  team_id: team.id, process_date: processDate }])

            if (waiverError && waiverError.message.includes('unique_waiver_requests')) {
                return { status: 500, body: 'Waiver request already exists' }

            } else if (waiverError) {
                console.log(waiverError)
                return { status: 500, body: waiverError.message }
            }

            return { status: 200, body: 'Waiver Claim Submitted' }

        }

        //CASE - player is waivered and dropping player
        if (playerToAdd.waiver && drop_player) {

            if (!playerOnTeam) {
                return { status: 500, body: 'Player not on team' }
            }
            //Next Tuesday
            const processDate = new Date();
            processDate.setDate(processDate.getDate() + (2 + 7 - processDate.getDay()) % 7);
            //create a waiver 

            const { data: createWaiver, error: waiverError } = await supabase
                .from('waivers')
                .insert([{ league_id: params.id, add_player_leagues_id: playerToAdd.id, drop_player_leagues_id: playerOnTeam.id, team_id: team.id, process_date: processDate }])

            if (waiverError && waiverError.message.includes('unique_waiver_requests')) {
                return { status: 500, body: 'Waiver request already exists' }

            } else if (waiverError) {
                console.log(waiverError)
                return { status: 500, body: waiverError.message }
            }
         

            return { status: 200, body: 'Waiver Claim Submitted' }
        }


        //!waivered && !team_full = add player to team

        //waivered && !team_full = set waiver claim


        return { status: 200, body: 'No Player Added' }
    }
}