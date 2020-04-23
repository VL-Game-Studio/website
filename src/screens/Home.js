import React, { useCallback, Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Anchor from 'components/Anchor';
import Form from 'components/Form';
import Input from 'components/Input';
import Button from 'components/Button';
import { useFormInput, useScrollRestore } from 'hooks';
import clients from 'data/clients';

export default function Home() {
  const name = useFormInput('');
  const platform = useFormInput('');
  const decklist = useFormInput('');
  useScrollRestore();

  const handleSubmit = useCallback(async event => {
    if (!name.value || !decklist.value) return;
    console.log(name.value);
    console.log(decklist.value);
    console.log(platform.value);
    event.preventDefault();

    try {
      const response = await fetch(`/functions/leagues/${platform.value}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          decklist: decklist.value,
        }),
      });

      const data = response.json();
      if (response.status !== 201) throw new Error(data.error);

      return data.message;
    } catch (error) {
      console.error(error);
      return alert(error);
    }
  }, [name.value, platform.value, decklist.value]);

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
        <Form onSubmit={handleSubmit}>
          <FormHeader>
            <h1>Decklist Form</h1>
            <Anchor as="button">Clear</Anchor>
          </FormHeader>
          <FormRow>
            <Input
              {...name}
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
            {...decklist}
            label="Deck List"
            placeholder="4 Snapcaster Mage"
            textarea
            inline
            required
          />
          <FormRow cta>
            <Button label="Submit" />
          </FormRow>
        </Form>
      </Wrapper>
    </Fragment>
  );
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 70px;
  min-height: calc(100vh - 140px);
  width: 100%;
`;

const FormHeader = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 8px 8px;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${props => props.cta && css`
    justify-content: flex-end;
  `}
`;
