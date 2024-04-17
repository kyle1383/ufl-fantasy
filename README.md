# UFL Fantasy

A rebuild of my previous XFL/USFL platforms for the new merged spring football league the UFL. 

## Stack
* Svelte/SvelteKit
* Supabase (Postgres)
* Sportradar USFL API

## Features 
### Realtime Draft 
* Integrates with supabase realtime (elixir based) to deliver a live multi-user draft
* Generates teams, matchups based on draft results

### Leagues and transactions 
* User auth allowing pw/email and google sign in
* Waiver transactions processing via cron job
* Roster modification (lineup changes, drops, etc)
* Multi league management 

### UFL API Integration 
* Update player stats live during games
* Calculate fantasy points based off of player performance.
