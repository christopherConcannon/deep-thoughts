import React from 'react';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

const client = new ApolloClient({
  // hardcoded absolute path for development only
  // uri : 'http://localhost:3001/graphql'
  
  // set "proxy" hash in package.json so dev server will use relative paths for HTTP requests so they will work in dev and production
  uri: '/graphql'
});

function App() {
	return (
		<ApolloProvider client={client}>
			<div className="flex-column justify-flex-start min-100-vh">
				<Header />
				<div className="container">
					<Home />
				</div>
				<Footer />
			</div>
		</ApolloProvider>
	);
}

export default App;
