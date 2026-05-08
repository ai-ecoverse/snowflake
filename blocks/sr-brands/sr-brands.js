export default async function decorate(block) {
  const rows = [...block.children];

  // Collect all images from rows
  const images = [];
  rows.forEach((row) => {
    const img = row.querySelector('img');
    if (img) images.push(img.cloneNode(true));
  });

  if (!images.length) return;

  // Build track with items doubled for seamless loop
  const track = document.createElement('div');
  track.className = 'sr-brands__track';

  [...images, ...images].forEach((img) => {
    const item = document.createElement('div');
    item.className = 'sr-brands__item';
    item.appendChild(img.cloneNode(true));
    track.appendChild(item);
  });

  block.innerHTML = '';
  block.appendChild(track);
}
