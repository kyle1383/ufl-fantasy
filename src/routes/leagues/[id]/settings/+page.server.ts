import { fail } from '@sveltejs/kit'
export const actions = {
    updateLeague: async ({request, params, locals: {supabase}}) => {
        const form = await request.formData()
        const sizeData = form.get('size')
        const name = form.get('name')
       

        const {data: league, error: leagueError} = await supabase
            .from('leagues')
            .select('size, teams(manager)')
            .eq('id', params.id)
            .single()

        const size =  parseInt(sizeData?.toString() || league.size)
        
        const filledTeams = [1, 1, 1, 1, 1] //league.teams.filter(team => team.manager !== null)
       
        const sizeChanged =  size !== league.size
      
        if ( size < filledTeams.length) {
            return fail(401, {message: 'Cannot reduce league size below number of filled teams'})
        }
    
        //update name property in league 
       /*const {data: updatedLeague, error: updateError} = await supabase
            .from('leagues')
            .update({name})
            .eq('id', params.id)*/

        //update league order and size

        //create new teams

        //remove teams 
        //update draft & picks

       
    }
}
    
