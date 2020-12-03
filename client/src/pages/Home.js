import React from 'react';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

// bring in query hook which will allow us to make requests to the GraphQL server we connected to (the props.client provided by ApolloProvider in App.js)
import { useQuery } from '@apollo/react-hooks';
//  bring in query functions
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';

const Home = () => {
  // when Home component loads, use useQuery hook to execute query request to GraphQL server established and provided by the ApolloProvider.  query is asynchronous so the useQuery hook provides a loading property so we can conditionally render data based on existence (or not) of data.  when query is complete, the returned data will be stored in the data variable
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // use object destructuring to extract 'data' from the 'useQuery' Hook's response and rename it 'userData' to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);



  // optional chaining...store thought data from data object if it exists, otherwise set thoughts to empty array
  const thoughts = data?.thoughts || [];
  // console.log(thoughts); // returns empty arrays until data is retrieved

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* once data has loaded from query render ThoughtList component */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList 
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
