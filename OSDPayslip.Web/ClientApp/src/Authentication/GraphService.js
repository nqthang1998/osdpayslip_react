var graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: done => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api("/me").get();
  return user;
}

export async function sendMail(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const sendMail = {
    message: {
      subject: "Testing? 222",
      body: {
        contentType: "Text",
        content: "This is a test."
      },
      toRecipients: [
        {
          emailAddress: {
            address: "phuoc.le@orientsoftware.com"
          }
        }
      ],
      attachments: [
        {
        "@odata.type": "#microsoft.graph.fileAttachment",
        "name": "attachment.pdf", //Format file name if you want
        "contentType": "application/pdf",
        "contentBytes": "" // Base64 File Here
      }
        ]
    },
    saveToSentItems: "false"
  };

  const response = await client.api("me/sendMail").post(sendMail);

  return response;
}
