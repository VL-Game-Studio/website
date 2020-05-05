import React, { useCallback, Fragment } from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Overlay from 'screens/Overlay';
import Form from 'components/Form';
import Input from 'components/Input';
import { useFormInput } from 'hooks';

export default function RegistrationForm(props) {
  const { league } = props;
  const history = useHistory();
  const name = useFormInput('');
  const username = useFormInput('');
  const mainboard = useFormInput('');
  const sideboard = useFormInput('');

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

      if (response.status !== 201) throw new Error(`An error occured while registering for event: ${league.id}.`);

      return history.push('/');
    } catch (error) {
      console.error(error);
      return alert(error);
    }
  }, [league, name.value, username.value, mainboard.value, sideboard.value, history]);

  return (
    <Fragment>
      <Helmet
        title={`Event ${league && league.id} - VidereMTG`}
      />
      <Overlay
        visible
        title={`Join League: ${league ? league.name : null}`}
        description="Please enter the following details to complete your league entry."
        onSubmit={handleJoinLeague}
        onCancel={() => history.push('/#events')}
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

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
