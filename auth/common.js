const cookie= new Cookie()

function isUserLoggedIn() {
    const cookies = document.cookie.split(';');
    const basicAuthCookie = cookies.find(cookie => cookie.trim().startsWith('basic_auth='));
    return basicAuthCookie !== undefined && basicAuthCookie.split('=')[1].trim() !== '';
}

 function logout() {
    cookie.delete(Cookie.KEY_BASIC_AUTH);
    cookie.delete(Cookie.KEY_STANDARD_AUTH);
    cookie.delete(Cookie.KEY_OPEN_ID_INFO);
    cookie.delete(Cookie.KEY_OPEN_ID_STATE);
    location.reload();
}