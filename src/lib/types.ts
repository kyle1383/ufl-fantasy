export interface League {
    id: number;
    created_at: string;
    name: string;
    size: number;
    roster_limits: string; // or a more specific type if you parse this JSON
    order: number[];
    draft_id: number;
    mock_drafts: null | any[]; // Replace any[] with a more specific type if known
    roster_size: number;
    teams: Team[];
    player_leagues: PlayerLeague[];
}

export interface Matchup {
    id: number;
    week: number;
    team_id_1: number;
    team_id_2: number;
    league_id: number;
    created_at: string;
    team_1: Team
    team_2: Team;

}


export interface Team {
    id: number;
    name: string;
    wins: number;
    losses: number;
    manager: string;
    priority: number;
    league_id: number;
    created_at: string;
    manager_name: string;
    player_leagues: PlayerLeague[];
}

export interface PlayerLeague {
    id: number;
    team: null | any; // Replace any with specific type if team structure is known
    depth: null | string; // Assuming depth could be a string, adjust if it's another type
    waiver: boolean;
    players: Player;
    rostered: boolean;
    league_id: number;
    score: number;
    player_id: string;
    team_position: null | string; // Assuming it's a string, adjust if it's another type
}

export interface Player {
    name: string;
    number: number;
    college: string;
    img_url: string;
    id: string;
    team_id: number;
    position: string;
    ufl_teams: XflTeam;
}

export interface XflTeam {
    id: number;
    city: string;
    name: string;
}

export interface WaiverClaim{
    id: number;
    created_at: string;
    league_id: number;
    add_player_leagues_id: number;
    team_id: number;
    has_processed: boolean;
    process_date: string;
    order: number;
    drop_player_leagues_id: number;
    result: null | string; // Assuming result can be a string if not null
    player_add: Player;
    player_drop: Player;
  
}

// Optional: If the 'roster_limits' property is consistently structured, 
// you can parse it as an object rather than a string for better type safety.
interface RosterLimits {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    K: number;
    BENCH: number;
}
