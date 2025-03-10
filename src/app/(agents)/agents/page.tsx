import React from 'react';

import AgentsHome from '@/components/agents/agents-home';
import { getAgents } from '@/server/actions/getAgents';

export default async function page() {
  const agents = await getAgents();
  return (
    <div>
      <AgentsHome agents={agents} />
    </div>
  );
}
