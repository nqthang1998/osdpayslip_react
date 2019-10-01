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

export async function sendMail(accessToken, recipient, pdfbaseString, Month, recipientName, ) { //recipient, pdfbaseString
    const client = getAuthenticatedClient(accessToken);
    let MonthText = ""

    let MonthName = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i = 0; i < MonthName.length; i++) {
        if ((Month - 1) === i) {
            MonthText = MonthName[i]
        }
    }
    const sendMail = {
        message: {
            subject: `Payslip for ${MonthText}`,
            body: {
                contentType: "HTML",
                content: `<div style="color: #2A5172"><div>Dear ${recipientName},</div><br /><div>Please find the attached file for your payslip of ${MonthText}.</div><div>Any question about salary, working day and other benefits, please write an email to HR department within 5 days from received salary for more details.</div><br /><div>Regards,</div></div>`
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: recipient
                    }
                }
            ],
            attachments: [
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    name: `payslip${MonthText}.pdf`, //Format file name if you want
                    contentType: "application/pdf",
                    contentBytes: pdfbaseString // Base64 File Here
                }
            ]
        },
        saveToSentItems: "false"
    };

    const response = await client.api("me/sendMail").post(sendMail);

    return response;
}
