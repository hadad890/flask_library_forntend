document.addEventListener('DOMContentLoaded', () => {
    let isUserLoggedIn = localStorage.getItem('isLoggedIn');

    if (isUserLoggedIn) {
        const signUpLink = document.getElementById('signUp');
        if (signUpLink) {
            signUpLink.removeAttribute('href');
            signUpLink.classList.add('disabled');  
        }
    }
});


search.addEventListener('click',(event)=>{
event.preventDefault(); 
window.location.href = 'index.html';
})


    document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM fully loaded and parsed");
    let access_Token = localStorage.getItem('access_Token');  
    const displayElement = document.getElementById('display');  

    try {
        
        const response = await axios.get('https://flask-library-backend.onrender.com/profile',{
            headers: {
                'Authorization': `Bearer ${access_Token}`  
            }
        });


        const { username, borrowed_books } = response.data;


        displayElement.innerHTML = `<h3>Welcome, ${username}!</h3>`;


        if (borrowed_books.length > 0) {
            let booksHtml = '<h4>Your Borrowed Books:</h4><div class="row">';  
            borrowed_books.forEach(book => {
                booksHtml += `
                    <div class="book-card" style="flex: 0 0 auto; width: 200px; margin: 10px; text-align: center; box-sizing: border-box;">
                        <div class="card" 
                            style="background-image: url('${book.img}'); 
                            background-size: cover; 
                            background-position: center; 
                            height: 300px; 
                            border-radius: 10px;
                            background-repeat: no-repeat;
                            position: relative;">
                            <div class="card-body" style="height: 100%; background-color: transparent;"></div>
                            <div class="book-info" style="display: none; position: absolute; bottom: 0; left: 0; right: 0; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 10px; border-radius: 0 0 10px 10px;">
                                <h5>${book.title}</h5>
                                <p>By: ${book.author}</p>
                                <p>Borrowed: ${book.borrow_date}</p>
                                <p>${book.return_date ? `Returned: ${book.return_date}` : 'Not returned yet'}</p>
                            </div>
                        </div>
                        <div style="margin-top: 10px;">
                            <button onclick="returnBook(${book.id})" class="btn btn-danger">Return</button>
                        </div>
                    </div>`;
            });
            booksHtml += '</div>';  
            displayElement.innerHTML += booksHtml;

           
            const bookCards = document.querySelectorAll('.book-card .card');
            bookCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    const infoBox = card.querySelector('.book-info');
                    infoBox.style.display = 'block';
                });
                card.addEventListener('mouseleave', () => {
                    const infoBox = card.querySelector('.book-info');
                    infoBox.style.display = 'none';
                });
            });
        } else {
        
            displayElement.innerHTML += '<p>You have not borrowed any books yet.</p>';
        }

    } catch (error) {
        console.error('Error fetching profile data:', error);
        displayElement.innerHTML = '<p>Error loading profile data. Please try again later.</p>';
    }
});



const returnBook = async (bookId) => {
    let access_Token = localStorage.getItem('access_Token');  
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://flask-library-backend.onrender.com/return-book',
            data: {
                book_id: bookId  
            }, 
            headers: {
               'Authorization': `Bearer ${access_Token}`
            }
        });

        if (response.status === 200) {
            Toastify({
                text: "Book returned successfully!",
                className: "info",
                position: 'center',
                style: {
                    background: "#4caf50", 
                }
            }).showToast();
            
            
            setTimeout(() => {
                location.reload();  
            }, 2000);
        } else {
            
            Toastify({
                text: "Failed to return the book. Please try again.",
                className: "error",
                position: 'center',
                style: {
                    background: "#f80404",  
                }
            }).showToast();
        }
    } catch (error) {
        console.error('Error returning the book:', error);
        
        Toastify({
            text: "Error returning the book. Please try again.",
            className: "error",
            position: 'center',
            style: {
                background: "#f80404",  
            }
        }).showToast();
    }
};


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
