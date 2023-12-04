// written with copilot
function hideEmailPartially(email: string): string {
  const [name, domain] = email.split('@');
  const nameLength = name.length;
  const namePart = name.slice(0, Math.floor(nameLength / 3));
  const domainPart = domain.slice(0, Math.floor(domain.length / 3));
  return `${namePart}...@${domainPart}...`;
}

export async function inviteAttendee(email: string, roomId: string) {
  if (!process.env.CLICKMEETING_API_KEY) {
    throw new Error('CLICKMEETING_API_KEY env variable should be set');
  }

  console.debug(`Inviting ${hideEmailPartially(email)} to the meeting`);

  try {
    const url = `https://api.clickmeeting.com/v1/conferences/${roomId}/invitation/email/en`;
    const data = new URLSearchParams();
    data.append('attendees[0][email]', email);
    data.append('template', 'basic');
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.CLICKMEETING_API_KEY,
      },
      body: data,
    });
    const respJson = await resp.json();
    console.log(`ClickMeeting response: ${JSON.stringify(respJson)}`);
  } catch (e) {
    console.error(`ClickMeeting request failed with error: ${JSON.stringify(e)}`);
    throw e;
  }
}
