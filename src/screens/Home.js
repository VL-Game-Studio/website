import React, { useState, useCallback, Fragment } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Form from 'components/Form';
import Input from 'components/Input';
import Button from 'components/Button';
import Overlay from 'screens/Overlay';
import { useFormInput, useScrollRestore } from 'hooks';
import clients from 'data/clients';
import icon from 'assets/icon.png';

export default function Home() {
  const author = useFormInput('');
  const platform = useFormInput('');
  const mainboard = useFormInput('');
  const sideboard = useFormInput('');
  const [overlayVisible, setOverlayVisible] = useState();
  useScrollRestore();

  const joinLeague = () => {
    setOverlayVisible(true);
  };

  const leaveLeague = () => {
    setOverlayVisible(false);
  };

  const handleSubmit = useCallback(async event => {
    event.preventDefault();

    try {
      const response = await fetch(`/functions/leagues/${platform.value}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          author: author.value,
          decklist: {
            mainboard: mainboard.value,
            sideboard: sideboard.value
          }
        }),
      });

      const data = response.json();
      if (response.status !== 201) throw new Error(data.error);

      return data.message;
    } catch (error) {
      console.error(error);
      return alert(error);
    }
  }, [platform.value, author.value, mainboard.value, sideboard.value]);

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
          <League>
            <LeagueInfo>
              <img src={icon} width="50px" alt="Videre Logo" />
              <Column>
                <h3>MTGO League</h3>
                <p>3 players</p>
              </Column>
            </LeagueInfo>
            <Column>
              <Button shiny style={{ marginBottom: 0 }} label="Join League" onClick={joinLeague} />
              <Button secondary label="Cancel League" />
            </Column>
          </League>
        </Leagues>
      </Wrapper>
      <Overlay
        visible={overlayVisible}
        title="Join League"
        description="Please enter the following details to complete your league entry."
        onSubmit={handleSubmit}
        onCancel={leaveLeague}
      >
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              {...author}
              label="Discord Username"
              inline
              required
            />
            <Input
              {...platform}
              label="Magic Client"
              list="game-clients"
              placeholder="MTGO, Untap, xMage, Cockatrice, etc."
              inline
            >
              <datalist id="game-clients">
                {clients.map(client => <option key={client} value={client}>{client}</option>)}
              </datalist>
            </Input>
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

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
