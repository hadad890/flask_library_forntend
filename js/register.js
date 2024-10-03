document.getElementById('login').addEventListener('click', function() {
    window.location.href = 'login.html'; 
});

let isUserLoggedIn = localStorage.getItem('isLoggedIn');







myBooksLink.addEventListener('click', (event) => {
        event.preventDefault();  
        if (isUserLoggedIn) {
            window.location.href = 'profile.html';
        } else {
            window.location.href = 'login.html';
        }
    });

    myBooksLink2.addEventListener('click', (event) => {
        event.preventDefault();  
        if (isUserLoggedIn) {
            window.location.href = 'profile.html';
        } else {
            window.location.href = 'login.html';
        }
    });


search.addEventListener('click',(event)=>{
    event.preventDefault(); 
    window.location.href = 'index.html';
})







const register = () => {
    console.log("register click");

    const display = document.getElementById("display");

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const gender = document.getElementById("gender").value;
    const age = document.getElementById("age").value;
    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value;
    const phone_number = document.getElementById("phone_number").value;
    console.log(email, pass);

    axios.post('https://flask-library-backend.onrender.com/register', {
        "email": email,
        "password": pass,
        "first_name": first_name,
        "last_name": last_name,
        "gender": gender,
        "age": age,
        "city": city,
        "address": address,
        "phone_number": phone_number
    })
    .then(response => {
        console.log("register successful", response.data);

        display.innerHTML = `
            <div class="alert alert-success" role="alert">
                Registration successful! Welcome, ${first_name} ${last_name}.
            </div>
        `;

        setTimeout(() => {
            Login_submit(email, pass);  
        }, 5000);  

    })
    .catch(error => {
        const errorMessage = error.response.data.error || "Something went wrong. Please try again.";
        Toastify({
            text: errorMessage,
            className: "info",
            position: 'center',
            style: {
                background: "#f80404",
            }
        }).showToast();
    });
};


const Login_submit = (email, pass) => {

    axios.post('https://flask-library-backend.onrender.com/login', {
        "email": email,
        "password": pass,
    })
    .then(response => {
        console.log("Login successful", response.data);

        const data = response.data;

        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userID', data.user_id);
        localStorage.setItem('access_Token',data.access_token)
        localStorage.setItem('refresh_Token',data.refresh_token)

        window.location.href = 'index.html';  
    })
    .catch(error => {
        console.error("Error during login", error);
    });
};





