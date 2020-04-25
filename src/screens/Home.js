import React, { useState, useEffect, useCallback, Fragment } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Anchor from 'components/Anchor';
import Form from 'components/Form';
import Input from 'components/Input';
import Button from 'components/Button';
import Overlay from 'screens/Overlay';
import { useFormInput, useLocalStorage, useScrollRestore } from 'hooks';
import clients from 'data/clients';
import prerender from 'utils/prerender';
import icon from 'assets/icon.png';

export default function Home() {
  const leagueName = useFormInput('');
  const leagueLimit = useFormInput('');
  const leaguePlatform = useFormInput('');
  const name = useFormInput('');
  const username = useFormInput('');
  const mainboard = useFormInput('');
  const sideboard = useFormInput('');
  const [leagues, setLeagues] = useState();
  const [league, setLeague] = useLocalStorage();
  const [joinOverlay, setJoinOverlay] = useState();
  const [createOverlay, setCreateOverlay] = useState();
  useScrollRestore();

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const response = await fetch('/functions/leagues', {
          method: 'GET',
          mode: 'cors',
        });

        const data = await response.json();
        if (response.status !== 200) throw new Error(data.error);

        return setLeagues(Object.values(data));
      } catch (error) {
        console.error(error.message);
        return alert('An error occured while creating your league.');
      }
    };

    if (!prerender) getLeagues();
  }, []);

  const createLeague = () => setCreateOverlay(true);
  const cancelCreateLeague = () => setCreateOverlay(false);

  const handleCreateLeague = useCallback(async event => {
    event.preventDefault();

    try {
      const response = await fetch(`/functions/leagues`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: leagueName.value,
          limit: leagueLimit.value,
          platform: leaguePlatform.value
        }),
      });

      const data = response.json();
      if (response.status !== 201) throw new Error(data.error);

      return setCreateOverlay(false);
    } catch (error) {
      console.error(error.message);
      return alert('An error occured while signing up for that league.');
    }
  }, [leagueName.value, leagueLimit.value, leaguePlatform.value]);

  const joinLeague = (league) => {
    setLeague(league);
    return setJoinOverlay(true);
  };

  const leaveLeague = () => {
    setLeague(null);
    return setJoinOverlay(false);
  };

  const handleJoinLeague = useCallback(async event => {
    event.preventDefault();

    try {
      const response = await fetch(`/functions/leagues/join/${league.id}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          username: username.value,
          mainboard: mainboard.value,
          sideboard: sideboard.value
        }),
      });

      const data = response.json();
      if (response.status !== 201) throw new Error(data.error);

      return setJoinOverlay(false);
    } catch (error) {
      console.error(error);
      return alert(error);
    }
  }, [league, name.value, username.value, mainboard.value, sideboard.value]);

  return (
    <Fragment>
      <Helmet
        title="Videre - pre-WAR Modern"
        meta={[{
          name: "description",
          content: "pre-WAR Modern",
        }]}
      />
      <Wrapper>
        <Header>
          <h1>Leagues</h1>
          <p>Last updated on {new Date(null).toLocaleDateString('default', { year: 'numeric', day: 'numeric', month: 'long' })}.</p>
        </Header>
        <Leagues>
          {leagues && leagues.map(({ id, name, limit, players = [], platform }) => (
            <League key={id}>
              <LeagueInfo>
                <img src={icon} width="50px" alt="Videre Logo" />
                <Column>
                  <h3>{name}</h3>
                  <p>{players.length}/{limit} players</p>
                </Column>
              </LeagueInfo>
              <Column>
                <Button shiny style={{ marginBottom: 0 }} label="Join League" onClick={() => joinLeague({ id, name, limit, players, platform })} />
                <Button secondary label="Cancel League" />
              </Column>
            </League>
          ))}
          <LeagueButton onClick={createLeague}>Create League</LeagueButton>
        </Leagues>
      </Wrapper>
      <Overlay
        visible={createOverlay}
        title="Create League"
        description="Finish creating your league by filling out the following fields."
        onSubmit={handleCreateLeague}
        onCancel={cancelCreateLeague}
      >
        <Form onSubmit={handleCreateLeague}>
          <FormRow>
            <Input
              {...leagueName}
              label="League Name"
              inline
              required
            />
            <Input
              {...leagueLimit}
              label="Player Quota"
              inline
              required
            />
          </FormRow>
          <Input
            {...leaguePlatform}
            label="Platform"
            list="game-clients"
            placeholder="MTGO, Untap, xMage, Cockatrice, etc."
            inline
            required
          >
            <datalist id="game-clients">
              {clients.map(client => <option key={client} value={client}>{client}</option>)}
            </datalist>
          </Input>
        </Form>
      </Overlay>
      <Overlay
        visible={joinOverlay}
        title={`Join League: ${league ? league.name : null}`}
        description="Please enter the following details to complete your league entry."
        onSubmit={handleJoinLeague}
        onCancel={leaveLeague}
      >
        <Form onSubmit={handleJoinLeague}>
          <FormRow>
            <Input
              {...name}
              label="Discord Username"
              inline
              required
            />
            <Input
              {...username}
              label={`${league ? league.platform : 'Game Platform'} Username`}
              inline
              required
            />
          </FormRow>
          <Input
            {...mainboard}
            label="Mainboard"
            placeholder="4 Snapcaster Mage"
            textarea
            inline
            required
          />
          <Input
            {...sideboard}
            label="Sideboard"
            placeholder="4 Leyline of the Void"
            textarea
            inline
          />
        </Form>
      </Overlay>
    </Fragment>
  );
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 70px;
  min-height: calc(100vh - 140px);
  width: 100%;
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 42px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 24px;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
  }

  p {
    margin-bottom: 42px;
  }
`;

const Leagues = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const League = styled.div`
  align-items: center;
  background-color: rgb(47, 49, 54);
  background-repeat: no-repeat;
  background-size: auto 100%;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  max-width: 660px;
`;

const LeagueInfo = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 50px 1fr;
  margin-right: 8px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    padding: 0;
  }

  p {
    font-size: 14px;
    font-weight: 700;
    margin: 0;
    padding: 0;
  }
`;

const LeagueButton = styled(Anchor).attrs(() => ({
  as: 'button'
}))`
  margin: 42px 0 0 0;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
