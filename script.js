document.addEventListener('DOMContentLoaded', function () {
    getData();
});

let editingId = null;

async function getData() {
    try {
        const response = await fetch('https://mongodb-backendd.vercel.app/api/products');
        const data = await response.json();

        console.log('All data retrieved:', data);
        displayDataAsCards(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayDataAsCards(data) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card col-md-3 mb-4';

        card.innerHTML = `
            <div class="card-body text-center">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Price: ${item.price}</p>
                <div class="icons-container">
                    <i class="fas fa-edit edit-icon" onclick="editData('${item._id}', '${item.name}', '${item.price}')"></i>
                    <i class="fas fa-times delete-icon" onclick="deleteData('${item._id}')"></i>
                </div>
            </div>
        `;

        cardContainer.appendChild(card);
    });
}

async function addData() {
    const name = document.getElementById('titleInput').value;
    const price = document.getElementById('priceInput').value;

    if (!name || !price) {
        alert('Please enter both title and price.');
        return;
    }

    const response = await fetch('https://mongodb-backendd.vercel.app/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price }),
    });

    handleResponse(response, 'Data added successfully!', 'Failed to add data.');
    getData(); // Refresh data after successful operation
    clearForm();
}

async function editData(id, name, price) {
    editingId = id;

    // Populate the edit modal fields
    document.getElementById('editTitleInput').value = name;
    document.getElementById('editPriceInput').value = price;

    // Open the edit modal
    $('#editModal').modal('show');
}

async function saveChanges() {
    const name = document.getElementById('editTitleInput').value;
    const price = document.getElementById('editPriceInput').value;

    if (!name || !price) {
        alert('Please enter both title and price.');
        return;
    }

    const response = await fetch(`https://mongodb-backendd.vercel.app/api/products/${editingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price }),
    });

    handleResponse(response, 'Data updated successfully!', 'Failed to update data.');

    // Reset editingId and close the modal after saving changes
    editingId = null;
    $('#editModal').modal('hide');

    getData(); // Refresh data after successful operation
}

async function deleteData(id) {
    const confirmDelete = confirm('Are you sure you want to delete this record?');

    if (confirmDelete) {
        const response = await fetch(`https://mongodb-backendd.vercel.app/api/products/${id}`, {
            method: 'DELETE',
        });

        handleResponse(response, 'Data deleted successfully!', 'Failed to delete data.');
    }
}

function handleResponse(response, successMessage, errorMessage) {
    const responseMessage = document.getElementById('responseMessage');

    if (response.ok) {
        responseMessage.textContent = successMessage;
        responseMessage.style.color = 'green';

        // Refresh data after successful operation
        getData();
    } else {
        responseMessage.textContent = errorMessage;
        responseMessage.style.color = 'red';
    }
}

function clearForm() {
    // Clear form fields
    document.getElementById('titleInput').value = '';
    document.getElementById('priceInput').value = '';
}
