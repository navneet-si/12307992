const { Log } = require('../logging_middleware/log');

const weights = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

let top10 = [];

function compare(a, b) {
    if (weights[a.Type] !== weights[b.Type]) {
        return weights[b.Type] - weights[a.Type]; 
    }
    let timeA = new Date(a.Timestamp).getTime();
    let timeB = new Date(b.Timestamp).getTime();
    return timeB - timeA; 
}

async function fetchTop10() {
    try {
        await Log("Stage 6", "INFO", "PriorityInbox", "fetching from api");
        
        let res = await fetch("http://4.224.186.213/evaluation-service/notifications", {
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ1bmNyb3duZWRraW5nMDEwQGdtYWlsLmNvbSIsImV4cCI6MTc3ODc1NzQ2MiwiaWF0IjoxNzc4NzU2NTYyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzEzY2RiZWUtNTQ4NC00NTRkLTliODYtZjY1NDNkZTYyYzE0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibmF2bmVldCIsInN1YiI6ImQ5YmUzMjMwLWMyMDAtNGVjMS1hMzg3LTdkMzkwZmYzNWMxNyJ9LCJlbWFpbCI6InVuY3Jvd25lZGtpbmcwMTBAZ21haWwuY29tIiwibmFtZSI6Im5hdm5lZXQiLCJyb2xsTm8iOiIxMjMwNzk5MiIsImFjY2Vzc0NvZGUiOiJUUnZaV3EiLCJjbGllbnRJRCI6ImQ5YmUzMjMwLWMyMDAtNGVjMS1hMzg3LTdkMzkwZmYzNWMxNyIsImNsaWVudFNlY3JldCI6IkpHRnptemVIYkd2S3REVnUifQ.DQpg96XDOLFV1GGWQsu__z8GmI8Vucxpb3bK_TJZQ38"
            }
        });
        
        let data = await res.json();

        if (!data || !data.notifications) {
            await Log("Stage 6", "WARN", "PriorityInbox", "server returned empty data");
            return;
        }

        let msgs = data.notifications;

        for (let i = 0; i < msgs.length; i++) {
            top10.push(msgs[i]);
            top10.sort(compare); 
            
            if (top10.length > 10) {
                top10.pop(); 
            }
        }

        await Log("Stage 6", "SUCCESS", "PriorityInbox", { 
            message: "here are the top 10", 
            list: top10 
        });

    } catch (err) {
        await Log("Stage 6", "ERROR", "PriorityInbox", "uh oh, something broke");
    }
}

fetchTop10();