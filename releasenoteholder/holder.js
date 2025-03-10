class ReleaseNotesHolder {
    constructor() {
        this.notesHolder = new Map();
        this.#fetchReleaseNotesFromServer();
    }

    #fetchReleaseNotesFromServer() {
        const url = getLocationAddress() + '/release_notes';

        return fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok ' + res.status);
                }
                return res.json();
            })
            .then(releaseNotes => {
                releaseNotes.forEach(note => {
                    this.notesHolder.set(note.language, note.content);
                });
            })
            .catch(err => {
                console.error('Fetching release notes failed:', err);
                this.notesHolder.clear();
            })
    }

    GetReleaseNote() {
        return this.notesHolder.get(localStorage.getItem('current_language') || Languages.traditionalChinese);
    }

}