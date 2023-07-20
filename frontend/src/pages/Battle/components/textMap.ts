export const textMap = {
  quickAttack: {
    success: (name: string) =>
      `${name} swiftly strikes the opponent with a quick attack, catching them off guard. The sound of steel meeting flesh echoes through the arena as the opponent staggers backward, momentarily disoriented`,
    fail: (name: string) =>
      `${name} swiftly lunges forward, aiming for a quick strike, but their opponent is as quick as a viper. With uncanny reflexes, the opponent anticipates the attack and gracefully evades it, leaving ${name} momentarily off balance. The crowd gasps in anticipation as the Gladiator readies themselves for the opponent's imminent counterattack`,
  },
  normalAttack: {
    success: (name: string) =>
      `With a calculated swing, ${name} delivers a solid blow with a normal attack. The clash of weapons reverberates in the air as the opponent grunts in pain`,
    fail: (name: string) =>
      `With determination, ${name} delivers a well-measured strike, but their opponent proves to be a formidable adversary. The opponent's defenses hold strong, deflecting the ${name}’s attack with impeccable skill. The clash of weapons echoes through the arena, drawing the attention of the crowd, who watches in anticipation as the ${name} quickly recovers, preparing for their next move`,
  },
  hardAttack: {
    success: (name: string) =>
      `Gathering all their strength, ${name} unleashes a powerful strike with a resounding impact. The force of the blow sends shockwaves through the arena, causing the opponent to stumble backward, clutching their wounds`,
    fail: (name: string) =>
      `Gathering every ounce of strength, ${name} unleashes a mighty swing, aiming to deliver a crushing blow. However, their opponent is no stranger to the art of combat. With an instinctual maneuver, the opponent expertly parries the ${name}’s attack, turning the forceful strike into a mere glancing blow. The arena rumbles with the sound of clashing steel, as the ${name} finds themselves momentarily exposed and on the defensive, forced to react swiftly to the opponent's ensuing assault`,
  },
  moveRight: (name: string) => `${name} steps to the right`,
  moveLeft: (name: string) => `${name} steps to the left`,
  rest: (name: string) =>
    `Sensing the ebb and flow of battle, ${name} takes a moment to catch their breath, seeking respite in the midst of combat. Gladiator’s muscles tense and relax as they regain focus, rejuvenating their stamina for the challenges that lie ahead`,
};
