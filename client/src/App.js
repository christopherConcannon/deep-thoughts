import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

// ApolloClient will help us get data from components once we pass it through with ApolloProvider
const client = new ApolloClient({
  // instruct Apollo instance to retrieve token from localStorage every time we make a GraphQL request
  request: operation => {
    const token = localStorage.getItem('id_token');

    // set headers to include token whether request needs it or not.  if it does not, the resolver won't check for it
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  },

  // establish new connection to the GraphQL server

	// hardcoded absolute path for development only
	// uri : 'http://localhost:3001/graphql'

	// set "proxy" hash in package.json so dev server will use relative paths for HTTP requests so they will work in dev and production
	uri : '/graphql'
});

function App() {
	return (
    // Provider provides data to all components.  everything it wraps will eventually have access to the server's API data throught the client
		<ApolloProvider client={client}>
			<Router>
				<div className="flex-column justify-flex-start min-100-vh">
					<Header />
					<div className="container">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/signup" component={Signup} />
							<Route exact path="/profile/:username?" component={Profile} />
							<Route exact path="/thought/:id" component={SingleThought} />

              <Route component={NoMatch} />
						</Switch>
					</div>
					<Footer />
				</div>
			</Router>
		</ApolloProvider>
	);
}

export default App;
