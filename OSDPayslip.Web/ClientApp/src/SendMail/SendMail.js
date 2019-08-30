import { MyAuthenticationProvider } from "./MyAuthenticationProvider";

let clientOptions: ClientOptions = {
	authProvider: new MyCustomAuthenticationProvider(),
};
const client = Client.initWithMiddleware(clientOptions);