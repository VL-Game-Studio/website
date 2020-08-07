import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import NotFound from 'pages/NotFound';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import { Label, Title2 } from 'components/Type';
import Input from 'components/Input';
import Button from 'components/Button';
import { useEventData, useScrollRestore } from 'hooks';
import './Play.css';

const Play = ({
  history,
  match: { params: { eventID } }
}) => {
  const { events, activeEvent } = useEventData(eventID);
  useScrollRestore();

  return (
    <Fragment>
      {(events && !activeEvent) && <NotFound />}
      {activeEvent &&
        <Fragment>
          <Helmet
            title="Play - Project Modern"
          />
          <PageLayout>
            <Hero center>
              <Label>Round 1/5</Label>
              <Title2>Round 1 vs Opponent</Title2>
              <div className="play__input">
                <Input as="select">
                  <option>Record (wins-losses-ties)</option>
                  {['2-0-0', '2-1-0', '1-0-1', '1-1-1', '0-1-0', '0-2-0', '1-2-0', '0-1-1'].map(val => (
                    <option value={val}>{val}</option>
                  ))}
                </Input>
              </div>
              <div className="play__buttons">
                <Button className="play__back" label="Back" />
                <Button className="play__next" label="Next" />
              </div>
            </Hero>
          </PageLayout>
        </Fragment>
      }
    </Fragment>
  );
};

export default Play;
