# UFL Fantasy
I began creating a spring fantasy footbal platform 4 years ago when the XFL returned. I've since grown as a developer, and spring football has been tumultous (to say the least). I've entirely rebuilt the platform 3 times with different stacks:
* 2020 - XFL Fantasy | MERN Stack 
* 2021 - USFL Fantasy | React 
* 2022 - XFL Fantasy v2 | SvelteKit 

The current iteration is a continuation of the final XFL Fantasy site, updated for the new UFL. This process has allowed me to explore various development processes and frameworks (and taught me how much I love SvelteKit). 

The app is live at [uflfantasy.app](uflfantasy.app) and currently I am running a beta trial with 5 leagues. I'm planning to refine it and attract new users next season.

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

### Improvements from previous iteration 
* In the process of converting site to Typescript 
* Massive improvements to error handling 
* Beginning to develop test suite
