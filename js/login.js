const Login_submit = () => {
    const email = document.getElementById("login_email");
    const pass = document.getElementById("login_pass");

    axios.post('https://flask-library-backend.onrender.com/login', {
        "email": email.value,
        "password": pass.value,})
        
    .then(response => {
        console.log("Login successful", response.data);

        const data = response.data;

        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userID', data.user_id);
        localStorage.setItem('access_Token',data.access_token)
        localStorage.setItem('refresh_Token',data.refresh_token)
        localStorage.setItem('user_name',data.user_name)

        window.location.href = 'index.html';
    })
    .catch(error => {
        const errorMessage = error.response.data.error || "Invalid email or password.";
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






function updateLoginButton() {
    const loginButton = document.getElementById('login');  
    isUserLoggedIn = localStorage.getItem('isLoggedIn');
  
    if (isUserLoggedIn) {
        login.textContent = "Logout";
        login.onclick = () => {
            logout(); 
            console.log("Logout clicked");
        };
    } 
    else {
        login.textContent = "Login";
        login.onclick = () => {
            window.location.href = 'login.html';  
        };
    }
}


const logout = () => {
    const accessToken = localStorage.getItem('access_Token');  
    const refreshToken = localStorage.getItem('refresh_Token');  

    axios.post("https://flask-library-backend.onrender.com/logout", {
        refresh_token: refreshToken  
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}` 
        }
    })
    .then((response) => {
        console.log('Logged out successfully:', response.data);
        
        
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userID');
        localStorage.removeItem('user_name');
        localStorage.removeItem('access_Token');
        localStorage.removeItem('refresh_Token');
        
        window.location.href = 'login.html';
    })
    .catch((error) => {
        console.error("Logout failed:", error);
    });
};



updateLoginButton()
