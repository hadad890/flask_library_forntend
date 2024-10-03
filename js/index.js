let isUserLoggedIn = localStorage.getItem('isLoggedIn');
let userID = localStorage.getItem('userID');
let access_Token = localStorage.getItem('access_Token');  
let refresh_Token = localStorage.getItem('refresh_Token');
let user_name = localStorage.getItem('user_name');
let valid = false;
const loginButton = document.getElementById("login");
const signUp = document.getElementById("signUp")
let inactivityTimeout; 

if(isUserLoggedIn){
    startSessionTracking()
    trackUserActivity()
    updateLoginButton()
}else{
    updateLoginButton()
}



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




// done
const logout = () => {

    axios.post("https://flask-library-backend.onrender.com/logout",{
        refresh_token: refresh_Token  
    }, {
        headers: {
            'Authorization': `Bearer ${access_Token}` 
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






const refreshAccessToken = async() => {
    const refreshToken = localStorage.getItem('refresh_Token');

    if (!refreshToken) {
        console.error('No refresh token found');
        return false;  
    }

    try {
        const response = await axios.post('https://flask-library-backend.onrender.com/refresh', {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}` 
            }
        });

        localStorage.setItem('access_Token', response.data.access_token);
        localStorage.setItem('refresh_Token', response.data.refresh_token);

        console.log('Access token refreshed');
        return true;  
    } catch (error) {
        console.error('Token refresh failed:', error.response ? error.response.data.error : error.message);
        return false; 
    }
}


function validateToken() {
    return axios.post('https://flask-library-backend.onrender.com/validate-token', {}, {
        headers: {
            'Authorization': `Bearer ${access_Token}` 
        }
    })
    .then(response => {
        console.log('Token is valid:', response.data);
        return true;
    })
    .catch(error => {
        console.error('Invalid token:', error.response ? error.response.data : error.message);
        return false;
    });
}



// done
function startSessionTracking() {
    console.log("Session tracking started");

    async function checkSession() {
        console.log("Interval started");
        let isUserLoggedIn = localStorage.getItem('isLoggedIn');

        if (isUserLoggedIn) {
            try {
                const isValid = await validateToken(); 
                if (!isValid) {
                    console.log("Token invalid, attempting refresh...");
                    
                  
                    const isRefreshed = await refreshAccessToken();  
                    window.location.reload

                    if (!isRefreshed) {
                        console.log("Refresh failed, logging out...");
                        logout();  
                    }
                }
            } catch (error) {
                console.error("Error during session check:", error);
                logout();  
            }
        }
        setTimeout(checkSession, 31 * 60 * 1000); 
    }

    checkSession();
}








// done

function resetInactivityTimer() {
    console.log('Activity detected. Resetting inactivity timer...');
    clearTimeout(inactivityTimeout);  
    inactivityTimeout = setTimeout(() => {
        console.log("User inactive, logging out...");
        logout(); 
    }, 20 * 60 * 1000); 
}


function trackUserActivity() {
    window.addEventListener('load', resetInactivityTimer);  
    document.addEventListener('mousemove', resetInactivityTimer);  
    document.addEventListener('keydown', resetInactivityTimer); 
}




// done

function updateLoginButton() {
    const loginButton = document.getElementById('login');  
    isUserLoggedIn = localStorage.getItem('isLoggedIn');
  
    if (isUserLoggedIn) {
        loginButton.textContent = "Logout";
        loginButton.onclick = () => {
            logout(); 
            console.log("Logout clicked");
        };
    } 
    else {
        loginButton.textContent = "Login";
        loginButton.onclick = () => {
            window.location.href = 'login.html';  
        };
    }
}



// Done 
    document.addEventListener('DOMContentLoaded', function () {
        console.log("DOM fully loaded and parsed");

        const display = document.getElementById('display');

        axios.get('https://flask-library-backend.onrender.com/view')
            .then(response => {
                const books = response.data;

                const booksByCategory = {};

                books.forEach(book => {
                    if (!booksByCategory[book.category]) {
                        booksByCategory[book.category] = [];
                    }
                    booksByCategory[book.category].push(book);
                });

                Object.keys(booksByCategory).forEach((category, index) => {

                    display.innerHTML += `<a href="#" onclick="categoryPeress('${category}')" style="margin-left: 10px;">${category}</a>`;


                    const carouselId = `carousel-${index}`;
                    const carouselInnerId = `carousel-inner-${index}`;


                    let carouselHTML = `
                 <div style="background-color: rgb(235, 203, 162);" class="container my-4">
                    <div id="${carouselId}" class="carousel slide">
                        <div class="carousel-inner" id="${carouselInnerId}">`;


                    booksByCategory[category].forEach(book => {

                        const sanitizedSummary = book.summary.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                        const infoBoxId = `info-box-${category}-${book.id}`;

                        carouselHTML += `
                        <div class="book-container" style="position: relative; text-align: center; display: inline-block; margin: 10px;">
                            <div class="card" style="background-image: url('${book.img}'); background-size: cover; background-position: center; height: 350px; border-radius: 10px;"
                                onmouseover="showInfoBox('${infoBoxId}', '${sanitizedSummary}')" onmouseout="hideInfoBox('${infoBoxId}')">
                                <div class="card-body" style="height: 100%;"></div>
                            </div>
                            <div style="margin-top: 10px;">
                                <button onclick="borrow(${book.id})" class="btn btn-primary">${book.status}</button>
                            </div>
                            <div id="${infoBoxId}" class="info-box" style="display: none; position: absolute; top: 10px; left: 0; right: 0; background-color: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.5); z-index: 10;">
                                <p>${book.summary}</p>
                            </div>
                        </div>`;
                    });


                    carouselHTML += `
                        </div>
                        <a class="carousel-control-prev" href="javascript:void(0)" role="button" onclick="scrollCarousel('${carouselInnerId}', -1)">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="javascript:void(0)" role="button" onclick="scrollCarousel('${carouselInnerId}', 1)">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </a>
                    </div>
                </div>`;


                    display.innerHTML += carouselHTML;
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    function showInfoBox(infoBoxId) {
        const infoBox = document.getElementById(infoBoxId);
        if (infoBox) {
            infoBox.style.display = 'block';
        }
    }

    function hideInfoBox(infoBoxId) {
        const infoBox = document.getElementById(infoBoxId);
        if (infoBox) {
            infoBox.style.display = 'none';
        }
    }







    function scrollCarousel(carouselInnerId, direction) {
        const carouselContent = document.getElementById(carouselInnerId);
        const scrollAmount = 300;

        if (direction === 1) {
            carouselContent.scrollLeft += scrollAmount;
        } else if (direction === -1) {
            carouselContent.scrollLeft -= scrollAmount;
        }
    }







    // Done 
    const borrow = async (id) => {
    if (!isUserLoggedIn) {
        Toastify({
            text: "You need to log in to borrow a book.",
            className: "info",
            position: 'center',
            style: {
                background: "#f80404",
            }
        }).showToast();

       
        setTimeout(() => {
            window.location.href = 'login.html';  
        }, 2000);  
        return;  
    }

    try {
        const response = await axios.post('https://flask-library-backend.onrender.com/borrow', {
            cust_id: userID,
            book_id: id
        },{
            headers: {
                'Authorization': `Bearer ${access_Token}` 
            }
        });

        const { user_name, loan_date, return_date } = response.data;
        alert(`Success! Book borrowed by ${user_name}.
            \nLoan Date: ${loan_date}
            \nReturn Date: ${return_date}`);
            window.location.reload()

    } catch (error) {
        Toastify({
            text: "Book is already borrowed. Please choose another one.",
            className: "info",
            position: 'center',
            style: {
                background: "#f80404",
            }
        }).showToast();
    }
};












    // Done 
    const search = async (event) => {
        event.preventDefault();

        const category = document.getElementById('searchCategory').value;
        const keyword = document.getElementById('searchKeyword').value;
        const display = document.getElementById('display');

        try {
            const res = await axios.get(`https://flask-library-backend.onrender.com/search/${category}/${keyword}`);
            const books = res.data;
            const booksList = [];

            books.forEach(book => {
                booksList.push(book);
            });


            display.innerHTML = "";
            let htmlContent = '';
            booksList.forEach(book => {
                htmlContent += `
                <div class="book-card" style="flex: 0 0 auto; width: 200px; margin: 10px; text-align: center; box-sizing: border-box;">
                    <div class="card" 
                        style="background-image: url('${book.img}'); 
                        background-size: cover; 
                        background-position: center; 
                        height: 300px; 
                        border-radius: 10px;
                        background-repeat: no-repeat;">
                        <div class="card-body" style="height: 100%; background-color: transparent;"></div>
                    </div>
                    <div style="margin-top: 10px;">
                        <button onclick="borrow(${book.id})" class="btn btn-primary">${book.status}</button>
                    </div>
                </div>`;
            });
            display.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; overflow-x: auto; width: 100%;">
                ${htmlContent}
            </div> `;
            console.log(booksList);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                display.innerHTML = "<h1>No book found!</h1>";
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };


    const categoryPeress = async (category) => {
        try {
            const res = await axios.get(`https://flask-library-backend.onrender.com/search/category/${category}`);

            const books = res.data;

            const booksList = [];

            books.forEach(book => {
                booksList.push(book);
            });


            display.innerHTML = "";

            let htmlContent = '';
            booksList.forEach(book => {
                htmlContent += `
                <div class="book-card" style="flex: 0 0 auto; width: 200px; margin: 10px; text-align: center; box-sizing: border-box;">
                    <div class="card" 
                        style="background-image: url('${book.img}'); 
                        background-size: cover; 
                        background-position: center; 
                        height: 300px; 
                        border-radius: 10px;
                        background-repeat: no-repeat;">
                        <div class="card-body" style="height: 100%; background-color: transparent;"></div>
                    </div>
                    <div style="margin-top: 10px;">
                        <button onclick="borrow(${book.id})" class="btn btn-primary">${book.status}</button>
                    </div>
                </div>`;
            });

            display.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; overflow-x: auto; width: 100%;">
                ${htmlContent}
            </div>
        `;

            console.log(booksList);

        } catch (error) {
            if (error.response && error.response.status === 404) {
                display.innerHTML = "<h1>No book found!</h1>";
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }

    }