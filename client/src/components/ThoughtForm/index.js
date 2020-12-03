import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';
import { ADD_THOUGHT } from '../../utils/mutations';

const ThoughtForm = () => {
	const [ thoughtText, setText ] = useState('');
	const [ characterCount, setCharacterCount ] = useState(0);

  // the addThought() function will run the actual mutation. The error variable will initially be undefined but can change depending on if the mutation failed.
  

	const [ addThought, { error } ] = useMutation(ADD_THOUGHT, {
      // manually insert the new thought object into the cached array so component will re-render with new thought without a call to the server. The useMutation Hook can include an update function that allows us to update the cache of any related queries. The query we'll need to update is QUERY_THOUGHTS.  This will re-render the Home view with the updated thoughts without having to refresh browser to make another call to the server for new data
    // addThought is the new thought just created
    update(cache, {data: { addThought } }) {
      // wrap QUERY_THOUGHTS cache update in try/catch so it won't block QUERY_ME cache update below if there is an error ie profile route visited without first visiting home route
      try {     
        // read what's currently in the cache and store it in thoughts const. could potentially not exist yet, so wrap in a try...catch    
        const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
  
        // prepend the newest thought to the front of the array
        cache.writeQuery({
          query: QUERY_THOUGHTS,
          data: { thoughts: [addThought, ...thoughts] }
        });
      } catch (e) {
        console.error(e)
      }

      // need to update QUERY_ME cache so that Profile view will re-render without browser refresh
      // update me object's cache, appending new thought to the end of the array
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, thoughts: [...me.thoughts, addThought ] } }
      })
    }
  });

	const handleChange = (event) => {
		if (event.target.value.length <= 280) {
			setText(event.target.value);
			setCharacterCount(event.target.value.length);
		}
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		try {
			// add thought to database
			await addThought({
				variables : { thoughtText }
			});
			// clear form value
			setText('');
			setCharacterCount(0);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div>
			<p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
				Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
			</p>
			<form
				className="flex-row justify-center justify-space-between-md align-stretch"
				onSubmit={handleFormSubmit}
			>
				<textarea
					placeholder="Here's a new thought..."
					value={thoughtText}
					className="form-input col-12 col-md-9"
					onChange={handleChange}
				/>
				<button className="btn col-12 col-md-3" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
};

export default ThoughtForm;
