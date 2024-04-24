// @ts-ignore

export function findPlayer(position, depth, players) {
  const player = players.find(p => p.team_position === position && (p.depth === depth || p.team_position === 'BENCH'));
  return player ? player : null;
}

export function clickOutside(node) {

  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('click_outside', node)
      )
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}

export function calculateFantasyScore(player) {
  if (!player.stats) return 0;
  const passingYardsPoints = player.stats.passing?.yards / 25 || 0;
  const passingTouchdownPoints = player.stats.passing?.touchdowns * 4 || 0;
  const rushingYardsPoints = player.stats.rushing?.yards / 10 || 0;
  const rushingTouchdownPoints = player.stats.rushing?.touchdowns * 6 || 0;
  const receivingYardsPoints = player.stats.receiving?.yards / 10 || 0;
  const receivingTouchdownPoints = player.stats.receiving?.touchdowns * 6 || 0;
  const fumblePoints = player.stats.fumbles?.lost * -2 || 0;
  const missedFieldGoalPoints = player.stats.kicking?.missed * -1 || 0;
  const kickingPoints =
    player.stats.kicking?.made_19 * 3 +
    player.stats.kicking?.made_29 * 3 +
    player.stats.kicking?.made_39 * 3 +
    player.stats.kicking?.made_49 * 4 +
    player.stats.kicking?.made_50 * 5 || 0;
  const total =
    Math.round(
      (passingYardsPoints +
        passingTouchdownPoints +
        rushingYardsPoints +
        rushingTouchdownPoints +
        receivingYardsPoints +
        receivingTouchdownPoints +
        fumblePoints +
        missedFieldGoalPoints +
        kickingPoints) *
      100
    ) / 100;

  return total;
}

export function mergeArrays(homeArray, awayArray) {
  // Determine the maximum length of the two arrays
  const maxLength = Math.max(homeArray.length, awayArray.length);

  // Initialize an empty result array
  const result = [];

  // Loop through the arrays up to the maximum length
  for (let i = 0; i < maxLength; i++) {
    // Create an object for each pair of home and away
    const entry = {
      home: homeArray[i] || null,  // Use the home value or null if undefined
      away: awayArray[i] || null   // Use the away value or null if undefined
    };

    // Push the created object to the result array
    result.push(entry);
  }

  return result;
}

export function showToast(text) {
  // Create elements
  const toastContainer = document.createElement('div');
  const alertBox = document.createElement('div');
  const alertText = document.createElement('span');

  // Add classes and styles
  toastContainer.className = 'toast toast-center w-max';
  toastContainer.style.transition = 'opacity 0.5s';
  alertBox.className = 'alert bg-primary text-white min-w-xl';

  // Set text
  alertText.textContent = text;

  // Assemble the toast structure
  alertBox.appendChild(alertText);
  toastContainer.appendChild(alertBox);
  document.body.appendChild(toastContainer);

  // Make toast visible and auto-hide after 3 seconds
  setTimeout(() => {
    toastContainer.style.opacity = '0';
    setTimeout(() => toastContainer.remove(), 500); // Ensure fade out completes
  }, 3000);
}

export function calculateFpts(player){
  
		const passingPts = player.g_passing?.reduce((acc, pStats) => acc + (pStats.touchdowns * 4 + pStats.yards/25 - pStats.interceptions * 2), 0);
		const rushingPts = player.g_rushing?.reduce((acc, rStats) => acc + (rStats.touchdowns * 6 + rStats.yards/10), 0);
		const receivingPts = player.g_receiving?.reduce((acc, rStats) => acc + (rStats.touchdowns * 6 + rStats.yards/10 + rStats.receptions), 0);
		const kickingPts = player.g_kicking?.reduce((acc, kStats) => acc + (kStats.made_19 * 3 + kStats.made_29 + kStats.made_39 * 3 + kStats.made_49 * 4 + kStats.made_50 * 5), 0);
		const fpts = Math.round((passingPts + rushingPts + receivingPts + kickingPts) * 100) / 100;
		
	 return fpts;
}

export function calculateWeekFpts(player, week){
  const latestPassingStats = player.g_passing?.find(p => p.ufl_games.week === week);
  const latestRushingStats = player.g_rushing?.find(p => p.ufl_games.week === week);
  const latestReceivingStats = player.g_receiving?.find(p => p.ufl_games.week === week);
  const latestKickingStats = player.g_kicking?.find(p => p.ufl_games.week === week);

  const passingPts = latestPassingStats ? latestPassingStats.touchdowns * 4 + latestPassingStats.yards/25 - latestPassingStats.interceptions * 2 : 0;
  const rushingPts = latestRushingStats ? latestRushingStats.touchdowns * 6 + latestRushingStats.yards/10 : 0;
  const receivingPts = latestReceivingStats ? latestReceivingStats.touchdowns * 6 + latestReceivingStats.yards/10 + latestReceivingStats.receptions : 0;
  const kickingPts = latestKickingStats ? latestKickingStats.made_19 * 3 + latestKickingStats.made_29 + latestKickingStats.made_39 * 3 + latestKickingStats.made_49 * 4 + latestKickingStats.made_50 * 5 : 0;
  const fpts = Math.round((passingPts + rushingPts + receivingPts + kickingPts) * 100) / 100;
  return fpts;
}