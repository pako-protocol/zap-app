import React from 'react';

import ExamplesHome from '@/components/examples/example-home';
import { getExamples } from '@/server/actions/getExamples';

export default async function Page() {
  const examples = await getExamples();
  console.log('examples', examples);
  return (
    <div>
      <ExamplesHome examples={examples} />
    </div>
  );
}
