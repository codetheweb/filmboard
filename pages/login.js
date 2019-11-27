import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import cookie from 'js-cookie';
import {Section, Column, Title} from 'rbx';
import GoogleLogin from 'react-google-login';
import {GOOGLE_CLIENT_ID} from '../config';
import {fetchWithAuth} from '../components/lib/auth';

class LoginButton extends React.Component {
  constructor(props) {
    super(props);

    this.checkLogin = this.checkLogin.bind(this);
  }

  async checkLogin({tokenId}) {
    cookie.set('token', tokenId, {expires: 1});

    // Check login & get issued JWT
    try {
      const {token} = await fetchWithAuth('/api/login', {method: 'post', redirectOnError: false});

      cookie.set('token', token, {expires: 1});

      // Callback
      this.props.onLogin();
    } catch (_) {
      // TODO: better UX
      console.log('bad user');
      cookie.remove('token');
    }
  }

  render() {
    return (
      <Section>
        <Column.Group>
          <Column className="has-text-centered">
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              cookiePolicy="single_host_origin"
              onSuccess={this.checkLogin}
            />
          </Column>
        </Column.Group>
      </Section>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onLogin = this.onLogin.bind(this);
  }

  static async getInitialProps(ctx) {
    return {redirect: (ctx.query.redirect ? ctx.query.redirect : '/')};
  }

  onLogin() {
    Router.push(this.props.redirect);
  }

  render() {
    if (!cookie.get('token')) {
      return (
        <LoginButton onLogin={this.onLogin}/>
      );
    }

    return (
      <Section>
        <Column.Group centered>
          <Column className="has-text-centered">
            <Title size={3}>You&apos;re already logged in.</Title>
            <Title size={5}>Want to <Link href="/logout"><a>logout</a></Link>?</Title>
          </Column>
        </Column.Group>
      </Section>
    );
  }
}

export default Login;
