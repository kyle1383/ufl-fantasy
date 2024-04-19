
export async function GET(req) {
    //this should run about 50 x per game 
    console.log('added recent news')
    return new Response('Updated players');

}
