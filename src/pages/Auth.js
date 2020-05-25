import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from 'hooks';
import config from 'config';

export default function Auth(props) {
  const { search } = useLocation();
  const code = search.includes('?code=') && search.split('?code=')[1];
  const { user, redirect, dispatch } = useAppContext();

  useEffect(() => {
    async function authorize() {
      try {
        const credentials = btoa(`${config.clientID}:${config.secret}`);
        const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=https%3A%2F%2Fprojectmodern.gg%2Fauth`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
          },
        });
        if (response.status !== 200) throw new Error('An error occured between us and Discord.\nYour session may have expired.');

        const { access_token } = await response.json();
        const response2 = await fetch('https://discordapp.com/api/users/@me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`
          },
        });
        if (response2.status !== 200) throw new Error('An error occured with authenticating with Discord.');

        const data = await response2.json();
        dispatch({ type: 'setUser', value: data });

        return props.history.push(redirect || '/');
      } catch (error) {
        console.error(error.message);
        return props.history.push('/');
      }
    }

    if (!user && code) authorize();
  }, [code, dispatch, props.history, redirect, user]);

  if (!code || (user && !redirect)) return <Redirect to="/" />;

  return <Helmet title="Redirecting - Project Modern" />;
}
