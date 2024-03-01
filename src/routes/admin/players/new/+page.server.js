// @ts-nocheck
import { fail } from '@sveltejs/kit'

import { redirect } from '@sveltejs/kit';
import { load } from 'cheerio';
import { sortAndDeduplicateDiagnostics } from 'typescript';

export const actions = {
    default: async ({ locals: {supabase}, request, fetch }) => {
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
                                name_id: $(cells[1]).text().trim().replace(/\s/g, '_').toLowerCase()
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
            if (!unqPlayers.find(p => p.name_id === player.name_id)){
                unqPlayers.push(player)
            } else{
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
    }
}