const axios = require('axios');

async function testIntegration() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTc3OTEyNzU4NX0.ZG95UGFAXCUmyufgu-t4r40yuJiWbrDb94mvo_b-6Ow';
  const headers = { Authorization: `Bearer ${token}` };

  console.log("--- 1. Testing Incident Creation ---");
  try {
    const incidentRes = await axios.post('http://127.0.0.1:4004/graphql', {
      query: `
        mutation {
          createIncident(
            title: "Accident Test Integration",
            description: "Test de la liaison entre services",
            type: "ACCIDENT",
            latitude: 36.8,
            longitude: 10.2
          ) {
            id
            title
            status
          }
        }
      `
    }, { headers });
    
    console.log("Incident Created successfully:", incidentRes.data.data.createIncident);
  } catch (err) {
    console.error("Failed to create incident:", err.response ? err.response.data : err.message);
    return;
  }

  // Wait a moment for notification to process
  await new Promise(r => setTimeout(r, 1000));

  console.log("\n--- 2. Checking Notifications ---");
  try {
    const notifRes = await axios.post('http://127.0.0.1:4005/graphql', {
      query: `
        query {
          getNotifications {
            id
            message
            type
            recipientRole
          }
        }
      `
    }, { headers });
    
    const notifications = notifRes.data.data.getNotifications;
    console.log(`Found ${notifications.length} notifications.`);
    console.log("Latest notification:", notifications[0]);
    
    if (notifications[0] && notifications[0].message.includes("Accident Test Integration")) {
      console.log("\nSUCCESS: L'incident a bien été créé et la notification a été automatiquement générée !");
    } else {
      console.log("\n FAILED: La notification ne correspond pas à l'incident créé.");
    }
  } catch (err) {
    console.error("Failed to fetch notifications:", err.response ? err.response.data : err.message);
  }
}

testIntegration();
