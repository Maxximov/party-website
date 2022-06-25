let lest = document.getElementById('signin-form');
let login = document.querySelector('#us')
let password = document.querySelector('#pas')

console.log(lest);

lest.addEventListener('submit', async (e) => {
  e.preventDefault()

  let response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({username: login.value, password: password.value})
  })

  let data = await response.json()

  console.log(data)

  if (data.login) { 
    window.location.href = '/'
  } else {
    alert("Неверные данные для входа!")
    window.location.href = '/login'
  }
})

