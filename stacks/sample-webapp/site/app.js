const thoughts = [
  '"Collect moments, not metrics."',
  '"Drafts are proof you showed up."',
  '"Let the week breathe before you publish."',
  '"Make space for unfinished ideas."',
  '"Ship softly, learn loudly."'
];

const rotator = document.getElementById('rotator');
const shuffleButton = document.getElementById('shuffle');
let index = 0;

shuffleButton.addEventListener('click', () => {
  index = (index + 1) % thoughts.length;
  rotator.textContent = thoughts[index];
});

const countdown = document.getElementById('countdown');
const now = new Date();
const nextWednesday = new Date(now);
nextWednesday.setDate(now.getDate() + ((3 - now.getDay() + 7) % 7));
nextWednesday.setHours(7, 0, 0, 0);

const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
countdown.textContent = nextWednesday.toLocaleString('en-US', options);
