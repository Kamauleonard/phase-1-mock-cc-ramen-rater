
  document.addEventListener('DOMContentLoaded', () => {
    const ramenMenu = document.getElementById('ramen-menu');
    const ramenDetail = document.getElementById('ramen-detail');
    const newRamenForm = document.getElementById('new-ramen');
    const editRamenForm = document.getElementById('edit-ramen');
    let ramenData = [];
    let currentRamen = null; 
  
  
    fetch('http://localhost:3000/ramens')
      .then(response => response.json())
      .then(data => {
        ramenData = data;
        ramenData.forEach(ramen => {
          const img = document.createElement('img');
          img.src = ramen.image;
          img.alt = ramen.name;
          img.addEventListener('click', () => showRamenDetail(ramen));
          ramenMenu.appendChild(img);
        });
  
       
        if (ramenData.length > 0) {
          showRamenDetail(ramenData[0]);
        }
      });
  
   
    function showRamenDetail(ramen) {
      currentRamen = ramen;
      ramenDetail.querySelector('.detail-image').src = ramen.image;
      ramenDetail.querySelector('.name').textContent = ramen.name;
      ramenDetail.querySelector('.restaurant').textContent = ramen.restaurant;
      document.getElementById('rating-display').textContent = ramen.rating;
      document.getElementById('comment-display').textContent = ramen.comment;
    
      editRamenForm.dataset.id = ramen.id;
  
      const deleteButton = document.getElementById('delete-ramen');
      if (!deleteButton) {
        const newDeleteButton = document.createElement('button');
        newDeleteButton.textContent = 'Delete';
        newDeleteButton.id = 'delete-ramen';
        newDeleteButton.addEventListener('click', deleteRamen);
        ramenDetail.appendChild(newDeleteButton);
      }
    }
  
    newRamenForm.addEventListener('submit', event => {
      event.preventDefault();
      const newRamenData = {
        name: document.getElementById('new-name').value,
        restaurant: document.getElementById('new-restaurant').value,
        image: document.getElementById('new-image').value,
        rating: document.getElementById('new-rating').value,
        comment: document.getElementById('new-comment').value,
      };
  
     
      fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRamenData),
      })
        .then(response => response.json())
        .then(newRamen => {
          ramenData.push(newRamen);
          const img = document.createElement('img');
          img.src = newRamen.image;
          img.alt = newRamen.name;
          img.addEventListener('click', () => showRamenDetail(newRamen));
          ramenMenu.appendChild(img);
         
          showRamenDetail(newRamen);
        });
  
    
      newRamenForm.reset();
    });
  

    editRamenForm.addEventListener('submit', event => {
      event.preventDefault();
      const id = editRamenForm.dataset.id; 
      const newRating = parseInt(editRamenForm.querySelector('#new-rating').value, 10);
      const newComment = editRamenForm.querySelector('#new-comment').value;
  
      document.getElementById('rating-display').textContent = newRating;
      document.getElementById('comment-display').textContent = newComment;
  
      fetch(`http://localhost:3000/ramens/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });

      editRamenForm.reset();
    });

    function deleteRamen() {
      if (!currentRamen) return;
      const id = currentRamen.id;
 
      fetch(`http://localhost:3000/ramens/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
         
          const index = ramenData.findIndex(ramen => ramen.id === parseInt(id, 10));
          if (index !== -1) {
            ramenData.splice(index, 1);
          }
  
          const displayedRamen = document.querySelector(`#ramen-menu img[alt="${currentRamen.name}"]`);
          if (displayedRamen) {
            displayedRamen.remove();
          }
  
      
          ramenDetail.querySelector('.detail-image').src = '';
          ramenDetail.querySelector('.name').textContent = '';
          ramenDetail.querySelector('.restaurant').textContent = '';
          document.getElementById('rating-display').textContent = '';
          document.getElementById('comment-display').textContent = '';
  
     
          const deleteButton = document.getElementById('delete-ramen');
          if (deleteButton) {
            deleteButton.remove();
          }
        });
    }
  });
  