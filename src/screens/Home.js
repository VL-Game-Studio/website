import React, { useCallback, Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Anchor from 'components/Anchor';
import { useFormInput, useScrollRestore } from 'hooks';

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
        <Navigation>
          <h1>Videre - Pre-WAR Modern</h1>
          <div>
            <Anchor target="_blank" href="https://discord.gg/mjtTnr8">Discord Server</Anchor>
            <Anchor as="button">Appearance</Anchor>
          </div>
        </Navigation>
        <FormWrapper onSubmit={handleSubmit}>
          <Form>
            <FormHeader>
              <h1>Decklist Form</h1>
              <Anchor as="button">Clear</Anchor>
            </FormHeader>
            <FormRow>
              <div>
                <Label>Discord Username</Label>
                <Input {...name} required />
              </div>
              <div>
                <Label>Magic Client</Label>
                <Input {...platform} list="game-clients" placeholder="MTGO, Untap, xMage, Cockatrice, etc." />
                <datalist id="game-clients">
                  {['MTGO', 'Untap', 'xMage', 'Cockatrice'].map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </datalist>
              </div>
            </FormRow>
            <FormRow>
              <div>
                <Label>Decklist</Label>
                <TextArea {...decklist} placeholder="4 Snapcaster Mage" required />
              </div>
            </FormRow>
            <FormRow cta>
              <Button>Submit</Button>
            </FormRow>
          </Form>
        </FormWrapper>
      </Wrapper>
    </Fragment>
  );
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  padding: 8px;

  h1, ${Anchor} {
    color: ${props => props.theme.colorText};
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
    font-family: ${props => props.theme.fontStack};
  }
`;

const Navigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 100%;
  margin: 0px 8px 8px;

  div {
    display: flex;
    flex-direction: row;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 8px;
  padding: 8px;
  background: rgb(47, 49, 54) none repeat scroll 0% 0%;
  border-radius: 4px;
  box-shadow: rgba(4, 4, 5, 0.2) 0px 1px 0px,
              rgba(6, 6, 7, 0.05) 0px 1.5px 0px,
              rgba(4, 4, 5, 0.05) 0px 2px 0px;
`;

const FormHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 8px 8px;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;

  &, div {
    flex-grow: 1;
  }

  div {
    display: flex;
    flex-direction: column;
    margin: 8px 8px 0px;
  }

  ${props => props.cta && css`
    flex-wrap: column nowrap;

    * {
      align-self: flex-end;
    }
  `}
`;

const Label = styled.label`
  margin-bottom: 2px;
  font-size: 16px;

  ${props => props.aside && css`
    margin: 3px 1px 0px 0px;
    font-size: 13px;
    font-weight: 500;
  `}

  ${props => props.status === 'invalid' && css`
    color: rgb(240, 71, 71);
  `}

  ${props => props.status === 'valid' && css`
    color: rgb(67, 181, 129);
  `}
`;

const Input = styled.input`
  font-family: inherit;
  padding: 6px 8px;
  margin: 8px 0px;
  background: rgb(64, 68, 75) none repeat scroll 0% 0%;
  border: medium none;
  border-radius: 3px;
  outline: currentcolor none medium;
  color: rgb(220, 221, 222);
  font-size: 15px;
  line-height: 20px;
`;

const TextArea = styled.textarea`
  font-family: inherit;
  padding: 6px 8px;
  margin: 8px 0px;
  background: rgb(64, 68, 75) none repeat scroll 0% 0%;
  border: medium none;
  border-radius: 3px;
  outline: currentcolor none medium;
  color: rgb(220, 221, 222);
  font-size: 15px;
  line-height: 20px;
  resize: vertical;
  min-height: 240px;
`;

const Button = styled.button`
  min-width: 60px;
  min-height: 32px;
  max-height: 32px;
  margin: 8px;
  padding: 2px 15px;
  border: 1px solid rgb(114, 137, 218);
  border-radius: 3px;
  outline: currentcolor none medium;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  transition: all 167ms ease 0s;
  background: ${props => props.theme.colorAccent} none repeat scroll 0% 0%;
  color: ${props => props.theme.colorText};

  :hover:not(:disabled),
  :focus:not(:disabled) {
    background: rgb(102, 123, 196) none repeat scroll 0% 0%;
    border-color: rgb(102, 123, 196);
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
