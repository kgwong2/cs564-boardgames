function openEditModal(userId, boardgameId, rating, comment) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');
    form.action = `/review/edit/${userId}/${boardgameId}`;
    form.rating.value = rating;
    form.comment.value = comment;
    modal.style.display = 'block';
}
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}
function openDeleteModal(userId, boardgameId) {
    const modal = document.getElementById('deleteModal');
    const form = document.getElementById('deleteForm');
    form.action = `/review/delete/${userId}/${boardgameId}`;
    modal.style.display = 'block';
}
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeEditModal();
        closeDeleteModal();
    }
};