export default function registerSystemSettings() {
  const reload = foundry.utils.debounce(() => window.location.reload(), 250);

  // Internal System Migration Version
  game.settings.register('a5e', 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: ''
  });

  // Currency Weight
  game.settings.register('a5e', 'currencyWeight', {
    name: 'A5E.Settings.CoinWeightName',
    hint: 'A5E.Settings.CoinWeightHint',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  });

  // Diagonal Movement Rule
  game.settings.register('a5e', 'diagonalRule', {
    name: 'A5E.Settings.DiagName',
    hint: 'A5E.Settings.DiagHint',
    scope: 'world',
    config: true,
    default: 'normal',
    type: String,
    choices: {
      normal: 'A5E.Settings.DiagNormal',
      euclidean: 'A5E.Settings.DiagEuclidean',
      5105: 'A5E.Settings.Diag5105'
    },
    onChange: (rule) => { canvas.grid.diagonalRule = rule; }
  });

  // Default GM Setting for placing templates
  game.settings.register('a5e', 'placeItemTemplateDefault', {
    name: 'Place templates for items by default',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  // Enable settings for condition automation
  const conditions = [
    'blinded',
    'encumbered',
    'fatigue',
    'frightened',
    'grappled',
    'invisible',
    'paralyzed',
    'petrified',
    'poisoned',
    'prone',
    'rattled',
    'restrained',
    'slowed',
    'strife',
    'stunned',
    'unconscious'
  ];

  conditions.forEach((c) => {
    game.settings.register('a5e', `enableCondition${c.capitalize()}`, {
      name: game.i18n.format(
        'A5E.Settings.EnableConditionsName',
        { condition: game.i18n.localize(`A5E.Condition${c.capitalize()}`) }
      ),
      hint: game.i18n.format(
        'A5E.Settings.EnableConditionsHint',
        { condition: game.i18n.localize(`A5E.Condition${c.capitalize()}`) }
      ),
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
      onChange: reload
    });
  });
}
