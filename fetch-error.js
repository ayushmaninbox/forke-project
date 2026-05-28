async function run() {
  try {
    console.log('--- Fetching root page on 3000 ---')
    const res = await fetch('http://localhost:3000/')
    console.log('Status:', res.status, res.statusText)
    const text = await res.text()
    console.log('Body length:', text.length)
    console.log('Body preview:', text.slice(0, 1000))
  } catch (err) {
    console.error('Fetch failed:', err)
  }
}
run()
