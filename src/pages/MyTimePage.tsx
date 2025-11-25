// src/pages/MyTimePage.tsx

import { useOutletContext } from 'react-router-dom';
import { TimeTracker } from '../components/features/TimeTracker';

export function MyTimePage() {
  const { currentUser } = useOutletContext<{ currentUser: import('../entities/user/types').User }>();
  return <TimeTracker currentUser={currentUser} />;
}