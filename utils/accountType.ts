// Maps an account-type value (from the API) to its visuals. Two distinct
// uses, kept separate on purpose: `illustration` is the cartoon artwork shown
// on the signup FORM once a type is picked; `photo` is the real photo used as
// the full-bleed background on the account-type SELECTION cards. They must
// not be the same image — the form keeps the illustration style used across
// the rest of the auth flow, the cards use real photography.
const VISUALS = {
  organization: {
    illustration: require('../assets/images/auth/organization.png'),
    illustrationRatio: 900 / 683,
    photo: require('../assets/images/photos/organization.jpg'),
    badge: 'Enterprise',
  },
  team: {
    illustration: require('../assets/images/onboarding/team.png'),
    illustrationRatio: 900 / 689,
    photo: require('../assets/images/photos/team.jpg'),
    badge: 'Team',
  },
  individual: {
    illustration: require('../assets/images/auth/freelancer.png'),
    illustrationRatio: 900 / 775,
    photo: require('../assets/images/photos/freelancer.jpg'),
    badge: 'Individual',
  },
} as const;

function classify(value: string): keyof typeof VISUALS {
  if (value.includes('organization') || value.includes('business')) return 'organization';
  if (value.includes('team')) return 'team';
  return 'individual';
}

export function getAccountTypeVisual(value: string) {
  return VISUALS[classify(value)];
}
