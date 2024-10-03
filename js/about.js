let isUserLoggedIn = localStorage.getItem('isLoggedIn');
let userID = localStorage.getItem('userID');
const loginButton = document.getElementById("login");
const signUp = document.getElementById("signUp")
const search = document.getElementById("search")
const login = document.getElementById("login")





if (isUserLoggedIn) {
        signUp.removeAttribute('href');  
        signUp.classList.add('disabled'); 
}


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