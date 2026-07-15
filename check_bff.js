async function test() {
  const url = 'https://c9x.thec9group.com/api/app/listings/slug/ford-taurus-2025-luxury';
  try {
    const res = await fetch(url);
    console.log('URL:', url);
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Length:', text.length);
    console.log('Snippet:', text.substring(0, 1000));
  } catch (e) {
    console.error('Error fetching:', e.message);
  }
}
test();
