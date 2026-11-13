'use strict';

const address = document.getElementById('address');
const status = document.getElementById('status');
const form = document.getElementById('address-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const ok = await window.metis.navigate(address.value);
  if (!ok) status.textContent = 'Invalid or failed';
});
for (const name of ['back', 'forward', 'reload', 'home']) {
  document.getElementById(name).addEventListener('click', () => void window.metis.command(name));
}
window.metis.onState((state) => {
  if (document.activeElement !== address) address.value = state.url;
  document.getElementById('back').disabled = !state.canGoBack;
  document.getElementById('forward').disabled = !state.canGoForward;
  status.textContent = state.loading ? 'Loading' : 'Ready';
});
