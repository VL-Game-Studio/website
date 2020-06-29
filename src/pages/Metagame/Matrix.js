import React, { memo } from 'react';
import Hero from 'pages/Hero';

function Matrix(props) {

  return (
    <Hero
      center
      label="Matchup Matrix"
      title="Top Decks"
      {...props}
    />
  );
}

export default memo(Matrix);
