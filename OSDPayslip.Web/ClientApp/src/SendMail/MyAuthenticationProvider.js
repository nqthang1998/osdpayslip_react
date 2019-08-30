import React from 'react';
import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";

class MyAuthenticationProvider extends React.Component implements AuthenticationProvider {
	/**
	 * This method will get called before every request to the msgraph server
	 * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
	 * Basically this method will contain the implementation for getting and refreshing accessTokens
	 */
	async getAccessToken(): Promise<any> {
		return "abcd";
	}
}
export default MyAuthenticationProvider;