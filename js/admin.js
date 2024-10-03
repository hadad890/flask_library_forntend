let isUserLoggedIn = localStorage.getItem('isLoggedIn');
let access_Token = localStorage.getItem('access_Token');  
let refresh_Token = localStorage.getItem('refresh_Token');
const users_email = [];

document.addEventListener('DOMContentLoaded', async function () {
    const selectUserEmailLoans = document.getElementById("select_user_email_loans");
    const loanTableBody = document.querySelector("#loanTable tbody");

   
    try {
       
        const response = await axios.get('https://flask-library-backend.onrender.com/view_loans', {
            headers: {
                'Authorization': `Bearer ${access_Token}` 
            }
        });
        const loans = response.data;

        console.log(loans);  

        loans.forEach(loan => {
            if (!users_email.includes(loan.user_email)) {
                users_email.push(loan.user_email);
            }
        });

       
        users_email.forEach(email => {
            const option = document.createElement("option");
            option.value = email;
            option.textContent = email;
            selectUserEmailLoans.appendChild(option);
        });

        populateLoanTable(loans);

        
        selectUserEmailLoans.addEventListener('change', function () {
            const selectedEmail = selectUserEmailLoans.value;
            const filteredLoans = loans.filter(loan => loan.user_email === selectedEmail);
            populateLoanTable(filteredLoans);  
        });

    } catch (error) {
        console.error("Error fetching loans:", error);
    }
});


function populateLoanTable(loans) {
    const loanTableBody = document.querySelector("#loanTable tbody");
    loanTableBody.innerHTML = ''; 
    
    if (loans.length === 0) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 4;  
        noDataCell.textContent = 'No loans found for this user.';
        noDataRow.appendChild(noDataCell);
        loanTableBody.appendChild(noDataRow);
        return;
    }


    loans.forEach(loan => {
        const row = document.createElement("tr");

        const bookNameCell = document.createElement("td");
        bookNameCell.textContent = loan.book_name;

        const loanDateCell = document.createElement("td");
        loanDateCell.textContent = loan.loan_date;

        const returnDateCell = document.createElement("td");
        returnDateCell.textContent = loan.return_date;

        const statusCell = document.createElement("td");
        statusCell.textContent = loan.loan_status;


        row.appendChild(bookNameCell);
        row.appendChild(loanDateCell);
        row.appendChild(returnDateCell);
        row.appendChild(statusCell);

        loanTableBody.appendChild(row);
    });
}




document.addEventListener('DOMContentLoaded', async function () {
try {
const response = await axios.get('https://flask-library-backend.onrender.com/aprove', {
    headers: {
        'Authorization': `Bearer ${access_Token}` 
    }
});

if (response.status === 200) {
    console.log("User is an admin, rendering the page...");
}

} catch (error) {
if (error.response && error.response.status === 403) {
    console.log("User is not an admin, redirecting to login...");
    window.location.href = 'login.html';  
} else {
    console.error('Error checking admin status:', error);
    window.location.href = 'login.html';
}
}
});

if (isUserLoggedIn) {
signUp.removeAttribute('href');  
signUp.classList.add('disabled'); 
}




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
updateLoginButton()


search.addEventListener('click',(event)=>{
event.preventDefault(); 
window.location.href = 'index.html';
})





const logout = () => {
    const accessToken = localStorage.getItem('access_Token');  
    const refreshToken = localStorage.getItem('refresh_Token');  

    axios.post("http://127.0.0.1:5000/logout", {
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



document.addEventListener('DOMContentLoaded', async function () {
try {
const response = await axios.get('https://flask-library-backend.onrender.com/users', {
    headers: {
        'Authorization': `Bearer ${access_Token}` 
    }
});
const users = response.data;
console.log("Fetched users:", users);

const selectUserEmail = document.getElementById("select_user_email");


selectUserEmail.innerHTML = '';


users.forEach(user => {
    const option1 = document.createElement("option");
    option1.value = user.id;  
    option1.text = user.email; 
    users_email.push(user.email) 
    selectUserEmail.appendChild(option1);

});


if (users.length === 1) {
    const selectedUser = users[0];
    console.log("Only one user, auto-selecting:", selectedUser);

    document.getElementById("user_id").value = selectedUser.id;
    document.getElementById("first_name").value = selectedUser.first_name;
    document.getElementById("last_name").value = selectedUser.last_name;
    document.getElementById("gender").value = selectedUser.gender;
    document.getElementById("age").value = selectedUser.age;
    document.getElementById("city").value = selectedUser.city;
    document.getElementById("address").value = selectedUser.address;
    document.getElementById("phone_number").value = selectedUser.phone_number;

    // Set status
    document.getElementById("user_status").value = selectedUser.status === 'Active' ? 'Active' : 'Inactive';

   
    document.getElementById("updateUserBtn").setAttribute("onclick", `updateUser(${selectedUser.id})`);
}


selectUserEmail.addEventListener('change', function () {
    console.log("Change event triggered");
    const selectedUser = users.find(user => user.id == this.value);
    console.log("Selected user:", selectedUser);

    if (selectedUser) {
        document.getElementById("user_id").value = selectedUser.id;
        document.getElementById("first_name").value = selectedUser.first_name;
        document.getElementById("last_name").value = selectedUser.last_name;
        document.getElementById("gender").value = selectedUser.gender;
        document.getElementById("age").value = selectedUser.age;
        document.getElementById("city").value = selectedUser.city;
        document.getElementById("address").value = selectedUser.address;
        document.getElementById("phone_number").value = selectedUser.phone_number;
        
        
        document.getElementById("user_status").value = selectedUser.status === 'Active' ? 'Active' : 'Inactive';

       
        document.getElementById("updateUserBtn").setAttribute("onclick", `updateUser(${selectedUser.id})`);
    }
});

} catch (error) {
console.error('Error fetching users:', error);
}
});

console.log(users_email);


const updateUser = async (userId) => {

const updatedUserData = {
id: userId,  
first_name: document.getElementById("first_name").value,
last_name: document.getElementById("last_name").value,
gender: document.getElementById("gender").value,
age: document.getElementById("age").value,
city: document.getElementById("city").value,
address: document.getElementById("address").value,
phone_number: document.getElementById("phone_number").value,
status: document.getElementById("user_status").value
};

try {



const response = await axios.post('https://flask-library-backend.onrender.com/users', updatedUserData, {
    headers: {
        'Authorization': `Bearer ${access_Token}`
    }
});


console.log('Update response:', response.data);


Toastify({
    text: "User updated successfully!",
    className: "info",
    position: 'center',
    style: {
        background: "#4caf50",
    }
}).showToast();

} catch (error) {

console.error('Error updating user:', error);


Toastify({
    text: "Failed to update user. Please try again.",
    className: "error",
    position: 'center',
    style: {
        background: "#f80404",
    }
}).showToast();
}
};




async function updateBook(bookId) {
const bookName = document.getElementById("book_name").value;
const bookAuthor = document.getElementById("book_author").value;
const bookCategory = document.getElementById("book_category").value;
const bookYearPublished = document.getElementById("book_year_published").value;
const bookSummary = document.getElementById("book_summary").value;
const bookTypeBorrow = document.getElementById("book_type_borrow").value;
const bookImg = document.getElementById("book_img").value;
const bookStatus = document.getElementById("book_status").value;





const updatedBookData = {
name: bookName,
author: bookAuthor,
category: bookCategory,
year_published: bookYearPublished,
summary: bookSummary,
type_borrow: bookTypeBorrow,
img: bookImg,
status: bookStatus
};

try {

const response = await axios.post(`https://flask-library-backend.onrender.com/book_edit/${bookId}`, updatedBookData, {
    headers: {
       'Authorization': `Bearer ${access_Token}`  
    }
});


console.log("Book updated successfully:", response.data);

Toastify({
    text: "Book updated successfully!",
    className: "info",
    position: 'center',
    style: {
        background: "#4caf50",
    }
}).showToast();

} catch (error) {

console.error("Error updating book:", error);

Toastify({
    text: "Failed to update book. Please try again.",
    className: "error",
    position: 'center',
    style: {
        background: "#f80404",
    }
}).showToast();
}
}














document.addEventListener('DOMContentLoaded', async function () {
    try {

        const response = await axios.get('https://flask-library-backend.onrender.com/view');
        const books = response.data;
        console.log("Fetched books:", books);

        const selectBookName = document.getElementById("select_book_name");


        selectBookName.innerHTML = '';


        books.forEach(book => {
            const option = document.createElement("option");
            option.value = book.id;  // Store book ID as value
            option.text = book.name;
            selectBookName.appendChild(option);
        });


        selectBookName.addEventListener('change', function () {
            const selectedBook = books.find(book => book.id == this.value);
            console.log("Selected book:", selectedBook);
            if (selectedBook) {
                document.getElementById("book_id").value = selectedBook.id;
                document.getElementById("book_name").value = selectedBook.name;
                document.getElementById("book_author").value = selectedBook.author;
                document.getElementById("book_category").value = selectedBook.category;
                document.getElementById("book_year_published").value = selectedBook.year_published;
                document.getElementById("book_summary").value = selectedBook.summary;
                document.getElementById("book_type_borrow").value = selectedBook.type_borrow;
                document.getElementById("book_img").value = selectedBook.img;


                if (selectedBook.status === 'Borrow') {
                    document.getElementById("book_status").value = 'Borrow';
                } else {
                    document.getElementById("book_status").value = 'Unavailable';
                }
                document.getElementById("updateBookBtn").setAttribute("onclick", `updateBook(${selectedBook.id})`);

            }
        });

    } catch (error) {
        console.error('Error fetching books:', error);
    }
});




const addBook = async () => {
    const new_book_name = document.getElementById("new_book_name").value;
    const new_book_author = document.getElementById("new_book_author").value;
    const new_book_category = document.getElementById("new_book_category").value;
    const new_year_published = document.getElementById("new_year_published").value;
    const new_summary = document.getElementById("new_summary").value;
    const new_type_borrow = document.getElementById("new_type_borrow").value;
    const new_img = document.getElementById("new_img").value;

    if (!new_book_name || !new_book_author || !new_book_category || !new_year_published || !new_summary || !new_type_borrow) {
        Toastify({
            text: "Please fill in all required fields",
            className: "info",
            position: 'center',
            style: {
                background: "#f80404",
            }
        }).showToast();
        return;
    }

    try {

        const response = await axios.post('https://flask-library-backend.onrender.com/add_books', {
            name: new_book_name,
            author: new_book_author,
            category: new_book_category,
            year_published: new_year_published,
            summary: new_summary,
            type_borrow: new_type_borrow,
            img: new_img
        }, {
        
            headers: {
                'Authorization': `Bearer ${access_Token}` 
            }
        });


        Toastify({
            text: "Book added successfully!",
            className: "info",
            position: 'center',
            style: {
                background: "#4caf50",
            }
        }).showToast();
        document.getElementById("new_book_name").value = '';
        document.getElementById("new_book_author").value = '';
        document.getElementById("new_book_category").value = '';
        document.getElementById("new_year_published").value = '';
        document.getElementById("new_summary").value = '';
        document.getElementById("new_type_borrow").value = '';
        document.getElementById("new_img").value = '';

    } catch (error) {
        Toastify({
            text: "Failed to add book. Please try again.",
            className: "info",
            position: 'center',
            style: {
                background: "#f80404",
            }
        }).showToast();
        console.error('Error adding book:', error);
    }
};




