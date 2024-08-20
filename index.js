// get the input username;
const username = process.argv[2];

// function to get the activity of user
async function getGitActivity(username) {
  if (!username) {
    console.error("Please provide a GitHub username.");
    process.exit(1);
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/events`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found. Please check the username.");
    } else {
      throw new Error(`Error fetching data: ${response.status}`);
    }
  }

  const jsonData = await response.json();
  return displayActivity(jsonData);
}

// function to list the activity of user
function displayActivity(events) {
  if (events.length === 0) {
    console.log("No recent activity found.");
    return;
  }
  events.forEach((event) => {
    let action;
    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits.length;
        action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
        break;
      case "ForkEvent":
        action = `Forked ${event.repo.name}`;
        break;
      case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      case "IssuesEvent":
        action = `${
          event.payload.action.charAt(0).toUpperCase() +
          event.payload.action.slice(1)
        } an issue in ${event.repo.name}`;
        break;
      default:
        action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
        break;
    }
    console.log(`- ${action}`);
  });
}

// call the function to list the activity
getGitActivity(username);
