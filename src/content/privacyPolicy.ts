export const PRIVACY_POLICY_EFFECTIVE_DATE = 'September 7, 2026';

export interface PrivacyPolicySection {
  heading: string;
  body: string;
}

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    heading: 'Overview',
    body: 'Physingo is a study app for physical therapy students. This policy explains what information we collect when you use the app, how we use it, and the choices you have. Physingo is an educational study tool only — it does not collect, store, or process real patient health information.',
  },
  {
    heading: 'Information We Collect',
    body: 'Account information: if you create an account, we collect your email address (and, if you use Google Sign-In, your name and profile photo).\n\nStudy progress: your XP, streak, completed lessons, quiz answers, and accuracy. If you’re signed in, this is stored in your account so it syncs across devices. If you’re not signed in, it stays only on your device.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'We use your information to save and sync your study progress, authenticate you, and maintain and improve the app. We do not sell your information, and we do not use it for advertising.',
  },
  {
    heading: 'Third-Party Services',
    body: 'Physingo uses Firebase (a Google service) for account sign-in and to store your progress in the cloud. If you sign in with Google, Google also processes your sign-in on their end. See Google’s Privacy Policy at https://policies.google.com/privacy for details on how they handle data.',
  },
  {
    heading: 'Data Storage & Security',
    body: 'Your data is stored using Firebase’s cloud infrastructure with industry-standard safeguards. No method of storage or transmission is ever 100% secure, but we take reasonable steps to protect your information.',
  },
  {
    heading: 'Data Retention & Deletion',
    body: 'We keep your account data for as long as your account is active. You can request deletion of your account and associated data at any time by contacting us using the details below.',
  },
  {
    heading: "Children's Privacy",
    body: 'Physingo is not directed at children under 13, and we do not knowingly collect personal information from children under 13.',
  },
  {
    heading: 'Your Choices',
    body: 'You can use Physingo without creating an account; in that case your progress is stored only on your device and is not synced or backed up. You can sign out at any time, and you can request deletion of your account and data as described above.',
  },
  {
    heading: 'Changes to This Policy',
    body: 'We may update this policy from time to time. If we make material changes, we’ll update the effective date above.',
  },
  {
    heading: 'Contact Us',
    body: 'Questions about this policy or your data? Contact us at support@physingo.app.',
  },
];
