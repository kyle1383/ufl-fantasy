export function POST(request) {
    const body = { message: "hi" };
    return new Response(JSON.stringify(body))
}
  