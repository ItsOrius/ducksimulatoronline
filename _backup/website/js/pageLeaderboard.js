const parent = document.getElementById('leaderboard');
parent.innerHTML = "";

function getRankText(rank) {
  switch (rank) {
    case 1:
      return `<div style="color: #ee0;">#1</div>`;
    case 2:
      return `<div style="color: #bbb;">#2</div>`;
    case 3:
      return `<div style="color: #bf7f3f;">#3</div>`;
    default:
      return `<div>#${rank}</div>`;
  }
}

function load(page) {
  fetch("https://ducksimulator.com/api/v1/leaderboard?page=" + page).then(res => res.text()).then(text => {
    const orderedUsers = JSON.parse(text).users;
    for (let i = 0; i < 10; i++) {
      const user = orderedUsers[i];
      const div = document.createElement('section');
      div.classList.add('mini-profile');
      parent.appendChild(div);
      fetch("https://ducksimulator.com/api/v1/profile/" + user.id).then(res => res.json()).then(profile => {
        div.style = profile.displayStyle;
        div.innerHTML = `
          <h1>${getRankText(i + 1)}</h1>
          <img src="${profile.avatarURL}?size=128" alt="${profile.username}">
          <div class="user">
            <h2>${profile.username}#${profile.discriminator}</h2>
            <h3>Level ${profile.level}</h3>
          </div>
          <div class="align-right">
            <h2>${profile.xp.toLocaleString("en-US")} XP</h2>
            <h3>${profile.messages.toLocaleString("en-US")} messages</h3>
          </div>
        `;
      });
    }
  })
}

load(1);