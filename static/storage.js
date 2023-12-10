const saveModal = document.getElementById('save-modal')
const saveButton = document.getElementById('menu-save-button')
const saveCommitButton = document.getElementById('save-commit-button')
const saveCancelButton = document.getElementById('save-cancel-button')
const saveNameInput = document.getElementById('save-name-input')



saveButton.addEventListener('click', (event) => {
    saveModal.style.display = 'block'
})

saveCancelButton.addEventListener('click', (event) => {
    saveModal.style.display = 'none'
})

saveCommitButton.addEventListener('click', async (event) => {

    // Grab the input value
    let name = saveNameInput.value

    // Validate it
    if (!name) {
        alert('Please enter a name!')
        return
    }

    // Delete weird characters
    name = name.replace(/[/\\?%*:|"<>]/g, '-')

    try {
        // Post the data
        const response = await fetch(`/project/${name}/save`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 'bruh': 234234 }),
        });

        // Redirect to new project if renaming
        if (location.pathname != `/project/${encodeURIComponent(name)}`)
            location.href = `/project/${name}`
    } catch (error) {
        // An error occurred while saving
        alert(error)
    }

    // Hide the modal
    saveModal.style.display = 'none'
    

})