import React from 'react';
import ReactDOM from 'react-dom';
import config from 'react-global-configuration';

import App from './App';



config.set({ 
	dev: {
		api_url: 'https://devza.com/tests/tasks/'
	}
});

ReactDOM.render(			
		<App />,
  document.getElementById('App')
);



