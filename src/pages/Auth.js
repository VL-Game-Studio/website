import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from 'hooks';
import config from 'config';

function Auth(props) {
  const { search } = useLocation();
  const code = search.includes('code=') && search.split('code=')[1];
  const { user, redirect, dispatch } = useAppContext();

  useEffect(() => {
    async function authorize() {
      try {
        const data = new URLSearchParams();
        data.append('client_id', config.clientID);
        data.append('client_secret', config.secret);
        data.append('grant_type', 'authorization_code');
        data.append('code', code);
        data.append('redirect_uri', config.redirect);
        data.append('scope', 'identify');

        const response = await fetch('https://discordapp.com/api/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: data,
        });
        if (response.status !== 200) throw new Error('An error occured between us and Discord.\nYour session may have expired.');

        const { access_token } = await response.json();
        const response2 = await fetch('https://discordapp.com/api/users/@me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        });
        if (response2.status !== 200) throw new Error('An error occured with authenticating with Discord.');

        const userData = await response2.json();
        dispatch({ type: 'setUser', value: userData });

        if (redirect && redirect.includes('http')) window.open(redirect);

        return redirect && redirect.includes('http')
          ? props.history.push('/')
          : props.history.push(redirect || '/');
      } catch (error) {
        console.error(error.message);
        alert(error.message);
        return props.history.push('/');
      }
    }

    if (!user && code) authorize();

    return function cleanup() {
      dispatch({ type: 'setRedirect', value: null });
    };
  }, [code, dispatch, props.history, redirect, user]);

  if (!code) return <Redirect to="/" />;

  return <Helmet title="Redirecting - Project Modern" />;
}

export default Auth;
