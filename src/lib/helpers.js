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