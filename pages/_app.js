import React from 'react';
import App from 'next/app';
import Link from 'next/link';
import Router from 'next/router';
import {Container, Level} from 'rbx';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Navbar from '../components/navbar';
import {parseToken} from '../components/lib/jwt';
import {getBaseURL} from '../common/helpers';
import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import '../styles/main.scss';

export default class MyApp extends App {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUser: parseToken()
    };

    this.onLoginChange = this.onLoginChange.bind(this);
  }

  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);

    const pages = await (await fetch(`${getBaseURL(appContext.ctx)}/api/pages/navbar`)).json();

    return {...appProps, pages};
  }

  onLoginChange() {
    this.setState({loggedInUser: parseToken()});
  }

  componentDidMount() {
    // Close navbar before navigating to new page
    Router.events.on('routeChangeStart', () => {
      const burger = document.querySelector('#navbar-burger');

      if (burger.className.includes('is-active')) {
        burger.click();
      }
    });
  }

  render() {
    const {Component, pageProps} = this.props;

    return (
      <div>
        <Head>
          <title>Film Board</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width"/>

          <link rel="apple-touch-icon" sizes="57x57" href="/static/images/favicon/apple-icon-57x57.png"/>
          <link rel="apple-touch-icon" sizes="60x60" href="/static/images/favicon/apple-icon-60x60.png"/>
          <link rel="apple-touch-icon" sizes="72x72" href="/static/images/favicon/apple-icon-72x72.png"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/static/images/favicon/apple-icon-76x76.png"/>
          <link rel="apple-touch-icon" sizes="114x114" href="/static/images/favicon/apple-icon-114x114.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/static/images/favicon/apple-icon-120x120.png"/>
          <link rel="apple-touch-icon" sizes="144x144" href="/static/images/favicon/apple-icon-144x144.png"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/static/images/favicon/apple-icon-152x152.png"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/static/images/favicon/apple-icon-180x180.png"/>
          <link rel="icon" type="image/png" sizes="192x192" href="/static/images/favicon/android-icon-192x192.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="96x96" href="/static/images/favicon/favicon-96x96.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicon/favicon-16x16.png"/>
          <link rel="manifest" href="/static/images/favicon/manifest.json"/>
          <meta name="msapplication-TileColor" content="#000000"/>
          <meta name="msapplication-TileImage" content="/static/images/favicon/ms-icon-144x144.png"/>
          <meta name="theme-color" content="#000000"/>

          <style
            type="text/css"
            dangerouslySetInnerHTML={{__html: `
            @font-face {
              font-family: 'Soin Sans Neue';
              src: url('/static/fonts/SoinSansNeue-Bold.otf') format('opentype');
              font-weight: 600;
            }

            @font-face {
              font-family: 'Soin Sans Neue';
              src: url('/static/fonts/SoinSansNeue-Roman.otf') format('opentype');
            }
          `}}
          />
          {Component.darkBackground ? (
            <style
              type="text/css"
              dangerouslySetInnerHTML={{__html: `
              html, body {
                background-color: #111111;
              }

              .title {
                color: white !important;
              }
            `}}
            />
          ) : (<style/>)}
        </Head>
        <div className="page-container">
          <div className="content-wrap">
            <Container>
              <Navbar pages={this.props.pages.pages} folders={this.props.pages.folders} loggedInUser={this.state.loggedInUser ? this.state.loggedInUser.user : undefined} transparent={Component.transparentNav}/>
            </Container>

            <Component {...pageProps} loggedInUser={this.state.loggedInUser ? this.state.loggedInUser.user : undefined} onLoginChange={this.onLoginChange}/>
          </div>

          <footer className="has-text-grey">
            <Level breakpoint="mobile">
              <Level.Item align="left">
                <span>made by <a href="https://maxisom.me" target="_blank" rel="noopener noreferrer">max isom</a></span>
              </Level.Item>
              {
                this.state.loggedInUser ? (
                  <Level.Item align="right"><Link href="/logout"><a>logout</a></Link></Level.Item>
                ) : (
                  <Level.Item align="right"><Link href="/login"><a>login</a></Link></Level.Item>
                )
              }
            </Level>
          </footer>
        </div>
      </div>
    );
  }
}
